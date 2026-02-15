import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
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

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const NavItems = () => (
        <>
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Overview
                </h2>
                <div className="space-y-1">
                    <Button variant="secondary" className="w-full justify-start" asChild>
                        <Link href="/dashboard">
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

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden w-64 border-r bg-zinc-950/50 md:block">
                <div className="flex h-16 items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-bold" href="/dashboard">
                        <span className="text-xl tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            ParatodosIA
                        </span>
                    </Link>
                </div>
                <div className="py-4">
                    <NavItems />
                </div>
                <div className="absolute bottom-4 left-0 w-full px-6">
                    <form action={logoutAction}>
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header & Content */}
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
                                <span className="font-bold text-xl">Menu</span>
                            </div>
                            <div className="py-4">
                                <NavItems />
                                <div className="mt-8 px-3">
                                    <form action={logoutAction}>
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
