export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
}

export interface StoreData {
    name: string;
    description: string;
    heroImage: string;
    products: Product[];
}

export const DEMO_STORE_DATA: StoreData = {
    name: "Tienda Demo",
    description: "Una tienda de ejemplo para paratodos.ia",
    heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    products: [
        {
            id: "1",
            name: "Silla Eames",
            price: 150.00,
            category: "Hogar",
            image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400"
        },
        {
            id: "2",
            name: "Lámpara de Pie",
            price: 89.99,
            category: "Iluminación",
            image: "https://images.unsplash.com/photo-1507473888900-52e1ad142759?w=400"
        },
        {
            id: "3",
            name: "Mesa de Centro",
            price: 299.50,
            category: "Hogar",
            image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400"
        },
        {
            id: "4",
            name: "Sofá Modular",
            price: 899.00,
            category: "Hogar",
            image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400"
        },
        {
            id: "5",
            name: "Jarrón Cerámica",
            price: 45.00,
            category: "Decoración",
            image: "https://images.unsplash.com/photo-1581783342308-f792ca11ae96?w=400"
        },
        {
            id: "6",
            name: "Espejo Redondo",
            price: 120.00,
            category: "Decoración",
            image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400"
        }
    ]
};
