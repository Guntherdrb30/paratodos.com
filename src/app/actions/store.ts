'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { consumeRateLimit, resetRateLimit } from '@/lib/rate-limit';

const supportedLocales = new Set(['en', 'es']);
const REGISTRATION_LIMIT = 5;
const REGISTRATION_WINDOW_MS = 60 * 60 * 1000;

function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

function normalizeLocale(value: FormDataEntryValue | null) {
    return typeof value === 'string' && supportedLocales.has(value) ? value : 'es';
}

async function getClientIp() {
    const headerStore = await headers();
    const forwardedFor = headerStore.get('x-forwarded-for');
    const realIp = headerStore.get('x-real-ip');

    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
    }

    return realIp?.trim() || 'unknown';
}

export type CreateStoreState = {
    errors?: {
        name?: string[];
        category?: string[];
        template?: string[];
        userName?: string[];
        email?: string[];
        password?: string[];
        // New fields
        whatsapp?: string[];
        rif?: string[];
        cedula?: string[];
        terms?: string[];

        _form?: string[];
    };
    message?: string;
};

export async function createStoreAction(
    prevState: CreateStoreState,
    formData: FormData
): Promise<CreateStoreState> {
    const locale = normalizeLocale(formData.get('locale'));
    const name = ((formData.get('name') as string) ?? '').trim();
    const category = formData.get('category') as string;
    const template = formData.get('template') as string;
    // Branding
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    // Contact & Legal
    const whatsapp = ((formData.get('whatsapp') as string) ?? '').trim();
    const rif = ((formData.get('rif') as string) ?? '').trim();
    // Account
    const userName = ((formData.get('userName') as string) ?? '').trim();
    const email = normalizeEmail((formData.get('email') as string) ?? '');
    const password = formData.get('password') as string;
    const cedula = ((formData.get('cedula') as string) ?? '').trim();
    // Terms
    const terms = formData.get('terms') as string;
    const clientIp = await getClientIp();
    const rateLimitKey = `${clientIp}:${email || 'missing-email'}`;


    // Basic Validation
    if (!name || name.length < 3) {
        return { errors: { name: ['El nombre de la tienda debe tener al menos 3 caracteres.'] } };
    }
    if (!category) {
        return { errors: { category: ['Por favor selecciona una categoría.'] } };
    }
    if (!email || !email.includes('@')) {
        return { errors: { email: ['Por favor ingresa un correo electrónico válido.'] } };
    }
    if (!password || password.length < 6) {
        return { errors: { password: ['La contraseña debe tener al menos 6 caracteres.'] } };
    }
    if (!terms) {
        return { errors: { terms: ['Debes aceptar los términos y condiciones.'] } };
    }


    const rateLimit = consumeRateLimit({
        scope: 'register',
        key: rateLimitKey,
        limit: REGISTRATION_LIMIT,
        windowMs: REGISTRATION_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
        return {
            errors: {
                _form: [
                    `Demasiados intentos. Intenta de nuevo en ${rateLimit.retryAfterSeconds} segundos.`
                ],
            },
        };
    }

    // Generate Slug
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    try {
        // Check if slug exists
        const existingTenant = await prisma.tenant.findUnique({
            where: { slug },
        });

        if (existingTenant) {
            return {
                errors: {
                    name: ['Este nombre de tienda ya está en uso. Por favor elige otro.'],
                },
            };
        }

        // Check if user email exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                errors: {
                    email: ['Este correo electrónico ya está registrado.'],
                },
            };
        }

        // Transaction to create Tenant and User
        const { tenant, user } = await prisma.$transaction(async (tx) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name,
                    slug,
                    template,
                    primaryColor: primaryColor || '#000000',
                    secondaryColor: secondaryColor || '#ffffff',
                    whatsappNumber: whatsapp,
                    rif,
                    contractAccepted: true,
                },
            });

            // 2. Create User
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await tx.user.create({
                data: {
                    name: userName,
                    email,
                    role: 'OWNER',
                    tenantId: tenant.id,
                    password: hashedPassword,
                    cedula,
                },
            });

            return { tenant, user };
        });

        await createSession(user.id, tenant.id, user.role);
        resetRateLimit('register', rateLimitKey);

    } catch (error) {
        console.error('Error creating store:', error);
        return {
            message: 'Ocurrió un error inesperado al crear la tienda. Por favor intenta de nuevo.',
        };
    }

    // Redirect on success
    redirect(`/${locale}/dashboard`);
}
