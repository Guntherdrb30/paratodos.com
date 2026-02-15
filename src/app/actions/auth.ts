'use server'

import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'

const prisma = new PrismaClient()

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
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return {
            errors: {
                _form: ['Por favor ingresa tu correo y contraseña.']
            }
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
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

        await createSession(user.id, user.tenantId, user.role)

    } catch (error) {
        console.error('Login error:', error)
        return {
            message: 'Ocurrió un error inesperado.'
        }
    }

    redirect('/')
}
