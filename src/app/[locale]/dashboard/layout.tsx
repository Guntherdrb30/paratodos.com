import { requireAuth } from "@/lib/session";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutAction } from "@/app/actions/auth";

type DashboardNavItemsProps = {
    locale: string;
};

function DashboardNavItems({ locale }: DashboardNavItemsProps) {
    return (
        <>
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Overview
                </h2>
                <div className="space-y-1">
                    <Button variant="secondary" className="w-full justify-start" asChild>
                        <Link href={`/${locale}/dashboard`}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Store className="mr-2 h-4 w-4" />
                        Products
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Customers
                    </Button>
                </div>
            </div>
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Settings
                </h2>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        General
                    </Button>
                </div>
            </div>
        </>
    );
}

type DashboardLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    const { locale } = await params;
    await requireAuth(locale);

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="hidden w-64 border-r bg-zinc-950/50 md:block">
                <div className="flex h-16 items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-bold" href={`/${locale}/dashboard`}>
                        <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-xl tracking-tighter text-transparent">
                            ParatodosIA
                        </span>
                    </Link>
                </div>
                <div className="py-4">
                    <DashboardNavItems locale={locale} />
                </div>
                <div className="absolute bottom-4 left-0 w-full px-6">
                    <form action={logoutAction}>
                        <input type="hidden" name="locale" value={locale} />
                        <Button variant="outline" className="w-full justify-start border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex-1">
                <header className="flex h-16 items-center border-b px-6 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-4">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="flex h-16 items-center border-b px-6">
                                <span className="text-xl font-bold">Menu</span>
                            </div>
                            <div className="py-4">
                                <DashboardNavItems locale={locale} />
                                <div className="mt-8 px-3">
                                    <form action={logoutAction}>
                                        <input type="hidden" name="locale" value={locale} />
                                        <Button variant="outline" className="w-full justify-start text-red-500">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <span className="font-bold">Dashboard</span>
                </header>

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
