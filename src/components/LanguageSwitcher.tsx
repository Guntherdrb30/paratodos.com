"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
        // Replace the locale in the pathname
        const segments = pathname.split('/');
        // segments[1] is typically the locale in proper next-intl setup with routing, or segments[0] if it's root (empty) but here it splits to ['', 'es', ...]
        if (segments.length >= 2) {
            segments[1] = newLocale;
            const newPath = segments.join('/');
            router.push(newPath);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Switch Language">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLocaleChange('en')} disabled={locale === 'en'}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange('es')} disabled={locale === 'es'}>
                    Español
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
