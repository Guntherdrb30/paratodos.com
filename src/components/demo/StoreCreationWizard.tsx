"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Store, LayoutTemplate, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { createStoreAction, CreateStoreState } from "@/app/actions/store";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

interface StoreCreationWizardProps {
    onComplete?: (config: { name: string; category: string; template: string }) => void;
}

export function StoreCreationWizard({ onComplete }: StoreCreationWizardProps) {
    const initialState: CreateStoreState = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(createStoreAction, initialState);

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [template, setTemplate] = useState("MINIMAL");
    // New Account State
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");


    const handleNext = () => {
        if (step < 4) { // Increased steps
            setStep(step + 1);
        }
    };

    const isStepValid = () => {
        if (step === 1) return name.length > 2 && category !== "";
        if (step === 2) return userName.length > 2 && email.includes("@");
        if (step === 3) return template !== "";
        return true;
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-900/50 backdrop-blur-xl text-zinc-100">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-full ${step >= 1 ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Store size={20} />
                        </div>
                        <div className="h-[2px] w-12 bg-zinc-800">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%' }} />
                        </div>
                        <div className={`p-2 rounded-full ${step >= 2 ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                            <LayoutTemplate size={20} />
                        </div>
                        <div className="h-[2px] w-12 bg-zinc-800">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: step >= 3 ? '100%' : '0%' }} />
                        </div>
                        <div className={`p-2 rounded-full ${step >= 3 ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Sparkles size={20} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">
                        {step === 1 && "Start your Store"}
                        {step === 2 && "Create your Account"}
                        {step === 3 && "Choose a Style"}
                        {step === 4 && "Ready to Launch"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Tell us a bit about your business."}
                        {step === 2 && "Set up your admin credentials."}
                        {step === 3 && "Select a template that fits your brand."}
                        {step === 4 && "Review your configuration."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Store Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Modern Home Decor"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <SelectItem value="Carpintería">Carpintería</SelectItem>
                                        <SelectItem value="Hogar">Hogar</SelectItem>
                                        <SelectItem value="Fashion">Fashion</SelectItem>
                                        <SelectItem value="Tech">Technology</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="userName">Your Name</Label>
                                <Input
                                    id="userName"
                                    placeholder="John Doe"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
                                />
                                {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['MINIMAL', 'BOUTIQUE', 'MARKET'].map((t) => (
                                <div
                                    key={t}
                                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${template === t ? 'border-primary bg-primary/10' : 'border-zinc-800 bg-zinc-800/50'
                                        }`}
                                    onClick={() => setTemplate(t)}
                                >
                                    <div className="aspect-video w-full rounded-md bg-zinc-900 mb-3 overflow-hidden">
                                        {/* Placeholder for template preview image */}
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                            {t} Preview
                                        </div>
                                    </div>
                                    <p className="font-medium text-center text-sm">{t}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 4 && (
                        <form action={formAction}>
                            <input type="hidden" name="name" value={name} />
                            <input type="hidden" name="category" value={category} />
                            <input type="hidden" name="template" value={template} />
                            <input type="hidden" name="userName" value={userName} />
                            <input type="hidden" name="email" value={email} />

                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                {state.message && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                        {state.message}
                                    </div>
                                )}

                                <div className="rounded-lg bg-zinc-800/50 p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Store Name:</span>
                                        <span className="font-medium">{name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Category:</span>
                                        <span className="font-medium">{category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Admin:</span>
                                        <span className="font-medium">{userName} ({email})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Template:</span>
                                        <span className="font-medium">{template}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </form>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}
                    <Button
                        onClick={() => step === 4 ? document.querySelector('form')?.requestSubmit() : handleNext()}
                        disabled={!isStepValid() || isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Store...
                            </>
                        ) : (
                            <>
                                {step === 4 ? "Launch Store" : "Next"}
                                {step !== 4 && <ArrowRight className="ml-2 h-4 w-4" />}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
