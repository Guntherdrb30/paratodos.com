import { StoreData } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function BoutiqueTemplate({ data }: { data: StoreData }) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A]">
            {/* Boutique Header */}
            <header className="w-full py-6 bg-[#FDFBF7]">
                <div className="w-full max-w-7xl mx-auto px-8 flex flex-col items-center gap-4">
                    <h1 className="text-3xl font-serif text-[#1A1A1A] tracking-widest">{data.name}</h1>
                    <nav className="flex gap-8 text-sm uppercase tracking-wider font-medium text-[#666]">
                        <a href="#" className="hover:text-black transition-colors">Home</a>
                        <a href="#" className="hover:text-black transition-colors">Catalog</a>
                        <a href="#" className="hover:text-black transition-colors">About</a>
                    </nav>
                </div>
            </header>

            {/* Hero Split */}
            <div className="grid md:grid-cols-2 h-[70vh] w-full overflow-hidden">
                <div className="relative h-full w-full">
                    <Image
                        src={data.heroImage}
                        alt="Hero"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center items-center p-12 bg-[#F3EFE9] text-center">
                    <span className="text-xs uppercase tracking-[0.3em] mb-4 text-[#8C8C8C]">New Collection</span>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8 text-[#1A1A1A] max-w-md">
                        {data.description}
                    </h2>
                    <Button className="bg-[#1A1A1A] text-white hover:bg-[#333] rounded-none px-10 h-12 uppercase tracking-wider text-xs">
                        Explore Now
                    </Button>
                </div>
            </div>

            {/* Product Highlight */}
            <section className="w-full max-w-7xl mx-auto px-8 py-24">
                <div className="text-center mb-16">
                    <h3 className="font-serif text-3xl mb-2 text-[#1A1A1A]">Curated Picks</h3>
                    <div className="w-12 h-0.5 bg-[#D4C4B7] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {data.products.map((product) => (
                        <div key={product.id} className="text-center group">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <Button variant="outline" className="w-full border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white uppercase text-xs">Add to Bag</Button>
                                </div>
                            </div>
                            <h4 className="font-serif text-lg text-[#1A1A1A]">{product.name}</h4>
                            <p className="text-[#8C8C8C] text-sm mt-1 mb-2 italic">{product.category}</p>
                            <p className="font-medium text-[#1A1A1A]">${product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="bg-[#1A1A1A] text-[#999] py-16 text-center">
                <p className="font-serif text-2xl text-white mb-4">{data.name}</p>
                <p className="text-xs tracking-widest uppercase">Est. 2026</p>
            </footer>
        </div>
    );
}
