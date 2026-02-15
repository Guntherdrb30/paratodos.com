import { StoreData } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Menu, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

export function MarketTemplate({ data }: { data: StoreData }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Market Header */}
            <header className="bg-[#232f3e] text-white py-3 sticky top-0 z-50">
                <div className="w-full max-w-7xl mx-auto px-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-xl mr-4">
                        <Menu className="h-6 w-6 md:hidden" />
                        {data.name}
                    </div>

                    <div className="flex-1 max-w-2xl hidden md:flex relative text-black">
                        <Input
                            placeholder="Search products..."
                            className="rounded-l-sm rounded-r-none border-none h-10 ring-0 focus-visible:ring-0"
                        />
                        <Button className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 rounded-l-none rounded-r-sm h-10 px-4">
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="ml-auto flex items-center gap-6 text-sm font-medium">
                        <div className="hidden md:block">
                            <p className="text-xs font-normal text-slate-300">Hello, Sign in</p>
                            <p className="font-bold">Account</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-xs font-normal text-slate-300">Returns</p>
                            <p className="font-bold">& Orders</p>
                        </div>
                        <div className="flex items-end gap-1">
                            <ShoppingCart className="h-8 w-8" />
                            <span className="font-bold">Cart</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sub Header */}
            <div className="bg-[#37475a] text-white text-sm py-2 px-4 shadow-md mb-6">
                <div className="w-full max-w-7xl mx-auto flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <span className="font-bold flex items-center gap-1"><Menu className="h-4 w-4" /> All</span>
                    <span>Today's Deals</span>
                    <span>Customer Service</span>
                    <span>Registry</span>
                    <span>Gift Cards</span>
                    <span>Sell</span>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-12 gap-6 pb-20">
                {/* Sidebar (Desktop) */}
                <aside className="col-span-2 hidden lg:block space-y-6">
                    <div className="bg-white p-4 shadow-sm rounded-md border border-slate-200">
                        <h3 className="font-bold mb-3 text-sm">Departments</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-[#c45500] hover:underline">Electronics</a></li>
                            <li><a href="#" className="hover:text-[#c45500] hover:underline">Computers</a></li>
                            <li><a href="#" className="hover:text-[#c45500] hover:underline">Smart Home</a></li>
                            <li><a href="#" className="hover:text-[#c45500] hover:underline">Arts & Crafts</a></li>
                            <li><a href="#" className="hover:text-[#c45500] hover:underline">Automotive</a></li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 shadow-sm rounded-md border border-slate-200">
                        <h3 className="font-bold mb-3 text-sm">Avg. Customer Review</h3>
                        <div className="flex items-center text-[#ffa41c]"><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="w-4 h-4" /> <span className="text-slate-600 ml-1 text-xs">& Up</span></div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="col-span-12 lg:col-span-10">
                    {/* Banner */}
                    <div className="w-full h-64 relative bg-gray-200 rounded-lg overflow-hidden mb-6">
                        <Image
                            src={data.heroImage}
                            alt="Banner"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end p-8">
                            <h2 className="text-3xl font-bold text-white drop-shadow-md">{data.description}</h2>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">Results</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.products.map((product) => (
                            <Card key={product.id} className="h-full flex flex-col rounded-none overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                                <div className="relative aspect-square bg-white p-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>
                                <CardContent className="p-4 flex-1">
                                    <h3 className="font-medium text-base text-[#007185] hover:text-[#c7511f] cursor-pointer line-clamp-2 mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-[#ffa41c]">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <span className="text-xs text-[#007185] font-medium">34,500</span>
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xs align-top self-start mt-1">$</span>
                                        <span className="text-2xl font-medium text-[#0F1111]">{Math.floor(product.price)}</span>
                                        <span className="text-xs align-top self-start mt-1">{(product.price % 1).toFixed(2).substring(2)}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Delivery <span className="font-bold text-slate-700">Tomorrow</span></p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full bg-[#f7ca00] hover:bg-[#f2c200] text-[#0F1111] border border-[#fcd200] rounded-full text-sm h-8 shadow-sm">
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
