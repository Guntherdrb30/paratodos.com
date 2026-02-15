'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { loginAction, LoginState } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const initialState: LoginState = { message: '', errors: {} }
    const [state, formAction, isPending] = useActionState(loginAction, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl text-zinc-100">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Bienvenido de nuevo</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa a tu cuenta para administrar tu tienda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@ejemplo.com"
                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
                                disabled={isPending}
                            />
                            {state.errors?.email && (
                                <p className="text-red-500 text-sm">{state.errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
                                disabled={isPending}
                            />
                            {state.errors?.password && (
                                <p className="text-red-500 text-sm">{state.errors.password}</p>
                            )}
                        </div>

                        {state.errors?._form && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                {state.errors._form}
                            </div>
                        )}

                        <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-zinc-500">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/" className="text-primary hover:underline">
                            Crea tu tienda
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
