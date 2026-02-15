'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export type CreateStoreState = {
    errors?: {
        name?: string[];
        category?: string[];
        template?: string[];
        userName?: string[];
        email?: string[];

        _form?: string[];
    };
    message?: string;
};

export async function createStoreAction(
    prevState: CreateStoreState,
    formData: FormData
): Promise<CreateStoreState> {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const template = formData.get('template') as string;
    const userName = formData.get('userName') as string;
    const email = formData.get('email') as string;


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
        await prisma.$transaction(async (tx) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name,
                    slug,
                    template,
                    // Default plan and language provided by schema
                },
            });

            // 2. Create User
            await tx.user.create({
                data: {
                    name: userName,
                    email,
                    role: 'OWNER',
                    tenantId: tenant.id,
                    // Note: In a real app, hash the password here. 
                    // Since schema doesn't have password field yet, we assume external auth or need to add it.
                    // For now, we proceed as if we are creating the user record for our system.
                },
            });

            // 3. Create initial demo data or settings if needed
        });

    } catch (error) {
        console.error('Error creating store:', error);
        return {
            message: 'Ocurrió un error inesperado al crear la tienda. Por favor intenta de nuevo.',
        };
    }

    // Redirect on success
    redirect('/login?registered=true');
}
