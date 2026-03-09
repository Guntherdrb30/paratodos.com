'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { consumeRateLimit, resetRateLimit } from '@/lib/rate-limit'

const supportedLocales = new Set(['en', 'es'])
const LOGIN_LIMIT = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000

function normalizeEmail(value: string) {
    return value.trim().toLowerCase()
}

function normalizeLocale(value: FormDataEntryValue | null) {
    return typeof value === 'string' && supportedLocales.has(value) ? value : 'es'
}

async function getClientIp() {
    const headerStore = await headers()
    const forwardedFor = headerStore.get('x-forwarded-for')
    const realIp = headerStore.get('x-real-ip')

    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
    }

    return realIp?.trim() || 'unknown'
}

export type LoginState = {
    errors?: {
        email?: string[]
        password?: string[]
        _form?: string[]
    }
    message?: string
}

export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const locale = normalizeLocale(formData.get('locale'))
    const email = normalizeEmail((formData.get('email') as string) ?? '')
    const password = formData.get('password') as string
    const clientIp = await getClientIp()
    const rateLimitKey = `${clientIp}:${email || 'missing-email'}`

    if (!email || !password) {
        return {
            errors: {
                _form: ['Por favor ingresa tu correo y contraseña.']
            }
        }
    }

    const rateLimit = consumeRateLimit({
        scope: 'login',
        key: rateLimitKey,
        limit: LOGIN_LIMIT,
        windowMs: LOGIN_WINDOW_MS,
    })

    if (!rateLimit.allowed) {
        return {
            errors: {
                _form: [
                    `Demasiados intentos. Intenta de nuevo en ${rateLimit.retryAfterSeconds} segundos.`
                ]
            }
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                tenant: {
                    select: {
                        isActive: true,
                    },
                },
            },
        })

        if (!user || !user.password) {
            return {
                errors: {
                    _form: ['Credenciales inválidas.']
                }
            }
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return {
                errors: {
                    _form: ['Credenciales inválidas.']
                }
            }
        }

        if (!user.tenant.isActive) {
            return {
                errors: {
                    _form: ['Tu tienda esta inactiva.']
                }
            }
        }

        await createSession(user.id, user.tenantId, user.role)
        resetRateLimit('login', rateLimitKey)

    } catch (error) {
        console.error('Login error:', error)
        return {
            message: 'Ocurrió un error inesperado.'
        }
    }

    redirect(`/${locale}/dashboard`)
}

export async function logoutAction(formData: FormData) {
    const locale = normalizeLocale(formData.get('locale'))
    await deleteSession()
    redirect(`/${locale}/login`)
}
