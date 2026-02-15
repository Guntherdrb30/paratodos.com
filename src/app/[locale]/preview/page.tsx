"use client";

import { useState } from "react";
import { DEMO_STORE_DATA } from "@/lib/demo-data";
import { MinimalTemplate } from "@/components/templates/minimal/MinimalTemplate";
import { BoutiqueTemplate } from "@/components/templates/boutique/BoutiqueTemplate";
import { MarketTemplate } from "@/components/templates/market/MarketTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Settings } from "lucide-react";
import { StoreCreationWizard } from "@/components/demo/StoreCreationWizard";
import { Button } from "@/components/ui/button";

export default function TemplatePreviewPage() {
    const [config, setConfig] = useState<{ name: string; category: string; template: string } | null>(null);
    // Keep local template state for switching *after* wizard too, initialized from config if available
    const [currentTemplate, setCurrentTemplate] = useState("MINIMAL");

    const templates = {
        "MINIMAL": MinimalTemplate,
        "BOUTIQUE": BoutiqueTemplate,
        "MARKET": MarketTemplate,
    };

    const handleWizardComplete = (newConfig: { name: string; category: string; template: string }) => {
        setConfig(newConfig);
        setCurrentTemplate(newConfig.template);
    };

    if (!config) {
        return <StoreCreationWizard onComplete={handleWizardComplete} />;
    }

    const ActiveTemplate = templates[currentTemplate as keyof typeof templates] || MinimalTemplate;

    // Merge demo data with config
    const storeData = {
        ...DEMO_STORE_DATA,
        name: config.name,
        // We could also filter products by category here if we had more real data
    };

    return (
        <div className="relative">
            {/* Floating Control Panel */}
            <div className="fixed bottom-6 right-6 z-50 bg-black/90 text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 border border-zinc-800 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Preview Mode</span>
                </div>

                <Select value={currentTemplate} onValueChange={setCurrentTemplate}>
                    <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white h-9">
                        <SelectValue placeholder="Select Template" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="MINIMAL">Minimal Theme</SelectItem>
                        <SelectItem value="BOUTIQUE">Boutique Theme</SelectItem>
                        <SelectItem value="MARKET">Market Theme</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-zinc-400 hover:text-white"
                    onClick={() => setConfig(null)}
                    title="Restart Demo"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>

            {/* Render Active Template */}
            <ActiveTemplate data={storeData} />
        </div>
    );
}
