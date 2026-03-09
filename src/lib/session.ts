import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

function getEncodedKey() {
    const secretKey = process.env.SESSION_SECRET

    if (!secretKey) {
        throw new Error('Missing SESSION_SECRET environment variable.')
    }

    return new TextEncoder().encode(secretKey)
}

export type SessionPayload = {
    userId: string
    tenantId: string
    role: string
    expiresAt: Date
}

export type AuthContext = {
    session: SessionPayload
    user: {
        id: string
        email: string
        name: string | null
        role: string
        tenantId: string
        tenant: {
            id: string
            name: string
            slug: string
            isActive: boolean
            plan: string
        }
    }
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getEncodedKey())
}

export async function decrypt(session: string | undefined = '') {
    if (!session) {
        return null
    }

    try {
        const { payload } = await jwtVerify(session, getEncodedKey(), {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        return null
    }
}

function isSessionPayload(value: unknown): value is SessionPayload {
    if (!value || typeof value !== 'object') {
        return false
    }

    const payload = value as Record<string, unknown>

    return (
        typeof payload.userId === 'string' &&
        typeof payload.tenantId === 'string' &&
        typeof payload.role === 'string'
    )
}

export async function createSession(userId: string, tenantId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, tenantId, role, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    const payload = await decrypt(session)

    if (!isSessionPayload(payload)) {
        return null
    }

    return payload
}

export async function getAuthContext(): Promise<AuthContext | null> {
    const session = await getSession()

    if (!session) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            tenantId: true,
            tenant: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    isActive: true,
                    plan: true,
                },
            },
        },
    })

    if (!user) {
        return null
    }

    if (user.tenantId !== session.tenantId || user.role !== session.role) {
        return null
    }

    return {
        session,
        user,
    }
}

export async function requireAuth(locale: string) {
    const auth = await getAuthContext()

    if (!auth || !auth.user.tenant.isActive) {
        await deleteSession()
        redirect(`/${locale}/login`)
    }

    return auth
}

export async function requireRole(locale: string, roles: string[]) {
    const auth = await requireAuth(locale)

    if (!roles.includes(auth.user.role)) {
        redirect(`/${locale}/dashboard`)
    }

    return auth
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
