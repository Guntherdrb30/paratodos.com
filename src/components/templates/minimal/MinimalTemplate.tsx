import { StoreData } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export function MinimalTemplate({ data }: { data: StoreData }) {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            {/* Minimal Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-zinc-100">
                <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight uppercase">{data.name}</h1>
                    <nav className="flex gap-4 items-center">
                        <Button variant="ghost" size="sm">Search</Button>
                        <Button variant="ghost" size="sm">Cart (0)</Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 w-full max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-tight">
                    {data.description}
                </h2>
                <Button size="lg" className="rounded-full px-8">Shop All</Button>
            </section>

            {/* Product Grid */}
            <section className="w-full max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {data.products.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden rounded-sm">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">{product.name}</h3>
                                    <p className="text-zinc-500 text-sm">{product.category}</p>
                                </div>
                                <span className="font-semibold">${product.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="bg-zinc-50 py-12 border-t border-zinc-100 text-center text-sm text-zinc-400">
                <p>© 2026 {data.name}. Powered by ParatodosIA.</p>
            </footer>
        </div>
    );
}
