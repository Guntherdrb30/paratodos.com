"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ArrowRight,
    Check,
    Store,
    Palette,
    User,
    Camera,
    Package,
    FileText,
    Loader2,
    Upload,
    Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

import { createStoreAction, CreateStoreState } from "@/app/actions/store";
import { useActionState } from "react";

interface StoreCreationWizardProps {
    onComplete?: (config: { name: string; category: string; template: string }) => void;
}

export function StoreCreationWizard({ onComplete }: StoreCreationWizardProps) {
    const initialState: CreateStoreState = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(createStoreAction, initialState);
    const locale = useLocale();
    void onComplete;

    const [step, setStep] = useState(1);

    // Step 1: Store Info
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    // Step 2: Branding
    const [primaryColor, setPrimaryColor] = useState("#000000");
    const [secondaryColor, setSecondaryColor] = useState("#ffffff");
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Step 3: Account
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rif, setRif] = useState(""); // RIF / ID for Company
    const [cedula, setCedula] = useState(""); // Personal ID

    // Step 4: KYC
    const [kycFile, setKycFile] = useState<File | null>(null);

    // Step 5: Products Strategy
    const [productStrategy, setProductStrategy] = useState<"manual" | "pdf">("manual");

    // Step 6: Legal
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Hidden template field for now (defaults to MINIMAL)
    const [template] = useState("MINIMAL");


    const handleNext = () => {
        if (step < 6) {
            setStep(step + 1);
        }
    };

    const isStepValid = () => {
        if (step === 1) return name.length > 2 && category !== "" && whatsapp.length > 8;
        if (step === 2) return true; // Optional branding
        if (step === 3) return userName.length > 2 && email.includes("@") && password.length >= 6 && rif.length > 4 && cedula.length > 5;
        if (step === 4) return kycFile !== null;
        if (step === 5) return true;
        if (step === 6) return termsAccepted;
        return true;
    };

    const steps = [
        { icon: Store, label: "Info" },
        { icon: Palette, label: "Marca" },
        { icon: User, label: "Cuenta" },
        { icon: Camera, label: "KYC" },
        { icon: Package, label: "Prod" },
        { icon: FileText, label: "Legal" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-3xl border-zinc-800 bg-zinc-900/50 backdrop-blur-xl text-zinc-100 shadow-2xl">
                <CardHeader>
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -z-0 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -z-0 rounded-full transition-all duration-500"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = step >= i + 1;
                            const isCurrent = step === i + 1;

                            return (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive
                                            ? 'bg-zinc-900 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]'
                                            : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                                            } ${isCurrent ? 'scale-110' : ''}`}
                                    >
                                        <Icon size={16} />
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-primary' : 'text-zinc-600'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <CardTitle className="text-3xl text-center">
                        {step === 1 && "Tu Negocio"}
                        {step === 2 && "Identidad de Marca"}
                        {step === 3 && "Datos de Cuenta"}
                        {step === 4 && "Verificación (KYC)"}
                        {step === 5 && "Carga de Productos"}
                        {step === 6 && "Contrato Legal"}
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400 text-base">
                        {step === 1 && "Cuéntanos lo básico para configurar tu tienda."}
                        {step === 2 && "Personaliza la apariencia de tu tienda."}
                        {step === 3 && "Datos del responsable legal y acceso."}
                        {step === 4 && "Tomate una foto para verificar tu identidad."}
                        {step === 5 && "¿Cómo quieres subir tu catálogo inicial?"}
                        {step === 6 && "Acepta los términos para formalizar tu tienda."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="py-6">
                    <form action={formAction} id="wizard-form">
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="template" value={template} />

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre de la Tienda</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Ej. Tienda Moderna"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Categoría</Label>
                                            <Select value={category} onValueChange={setCategory} name="category">
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 h-12">
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectItem value="Carpintería">Carpintería</SelectItem>
                                                    <SelectItem value="Hogar">Hogar</SelectItem>
                                                    <SelectItem value="Moda">Moda</SelectItem>
                                                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp">WhatsApp de Atención</Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                                                <Input
                                                    id="whatsapp"
                                                    name="whatsapp"
                                                    placeholder="+58 412 1234567"
                                                    value={whatsapp}
                                                    onChange={(e) => setWhatsapp(e.target.value)}
                                                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary pl-10 h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Logo de la Empresa</Label>
                                            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors cursor-pointer text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                                    <Upload className="h-6 w-6 text-zinc-400" />
                                                </div>
                                                <p className="text-sm font-medium">Subir Logo (PNG, JPG)</p>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Arrastra o haz clic para seleccionar</p>
                                                {/* Hidden input for now */}
                                                <Input type="file" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                                            </div>
                                            {logoFile && <p className="text-xs text-green-500 flex items-center"><Check className="h-3 w-3 mr-1" /> {logoFile.name}</p>}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Color Primario ({primaryColor})</Label>
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: primaryColor }} />
                                                    <Input
                                                        type="color"
                                                        name="primaryColor"
                                                        value={primaryColor}
                                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                                        className="w-full h-12 p-1 bg-zinc-800 border-zinc-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Color Secundario ({secondaryColor})</Label>
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: secondaryColor }} />
                                                    <Input
                                                        type="color"
                                                        name="secondaryColor"
                                                        value={secondaryColor}
                                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                                        className="w-full h-12 p-1 bg-zinc-800 border-zinc-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="userName">Nombre del Representante</Label>
                                            <Input
                                                id="userName"
                                                name="userName"
                                                placeholder="Juan Pérez"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cedula">Cédula de Identidad</Label>
                                            <Input
                                                id="cedula"
                                                name="cedula"
                                                placeholder="V-12345678"
                                                value={cedula}
                                                onChange={(e) => setCedula(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rif">RIF de la Empresa</Label>
                                        <Input
                                            id="rif"
                                            name="rif"
                                            placeholder="J-12345678-0"
                                            value={rif}
                                            onChange={(e) => setRif(e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="juan@empresa.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Contraseña</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary h-12"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col items-center text-center">
                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 w-full max-w-md">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Camera size={32} />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">Verificación de Identidad</h3>
                                        <p className="text-zinc-400 text-sm mb-6">
                                            Para garantizar la seguridad del marketplace, necesitamos que tomes una foto sosteniendo tu cédula de identidad.
                                        </p>

                                        <div className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-zinc-600 bg-black aspect-video flex items-center justify-center hover:border-primary transition-colors">
                                            {!kycFile ? (
                                                <div className="flex flex-col items-center">
                                                    <Camera className="mb-2 text-zinc-500" />
                                                    <span className="text-sm text-zinc-500">Tocar para abrir cámara</span>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full bg-zinc-800 flex items-center justify-center">
                                                    {/* File-input preview uses a local object URL, so next/image is not a good fit here. */}
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={URL.createObjectURL(kycFile)}
                                                        alt="Selfie Preview"
                                                        className="h-full w-full object-cover opacity-50"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Check className="w-12 h-12 text-primary" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Camera Input */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="user"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            className={`border-2 p-6 rounded-xl cursor-pointer transition-all hover:border-primary ${productStrategy === 'manual' ? 'border-primary bg-primary/5' : 'border-zinc-800 bg-zinc-900'}`}
                                            onClick={() => setProductStrategy('manual')}
                                        >
                                            <Package className={`h-8 w-8 mb-4 ${productStrategy === 'manual' ? 'text-primary' : 'text-zinc-500'}`} />
                                            <h3 className="font-semibold text-lg mb-2">Carga Manual</h3>
                                            <p className="text-sm text-zinc-400">Crear productos uno por uno desde el panel administrativo.</p>
                                        </div>

                                        <div
                                            className={`border-2 p-6 rounded-xl cursor-not-allowed opacity-70 border-zinc-800 bg-zinc-900 relative`}
                                        // onClick={() => setProductStrategy('pdf')}
                                        >
                                            <div className="absolute top-3 right-3 bg-purple-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">AI Beta</div>
                                            <FileText className="h-8 w-8 mb-4 text-purple-400" />
                                            <h3 className="font-semibold text-lg mb-2">Importar PDF con IA</h3>
                                            <p className="text-sm text-zinc-400">Nuestro agente leerá tu catálogo PDF y creará los productos automáticamente.</p>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-200 text-sm">
                                        <p>
                                            <strong>Nota:</strong> Tu plan incluye un periodo de prueba de <strong>10 días</strong> con un límite de <strong>5 productos</strong>.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="h-64 overflow-y-auto bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 text-xs text-zinc-400 leading-relaxed font-mono">
                                        <h4 className="text-white font-bold mb-2 text-sm">CONTRATO DE ADHESIÓN Y RESPONSABILIDAD</h4>
                                        <p className="mb-2">
                                            Al registrarse en ParatodosIA, LA TIENDA declara y acepta que:
                                        </p>
                                        <p className="mb-2">
                                            1. ParatodosIA actúa exclusivamente como plataforma tecnológica (Marketplace) para facilitar la conexión entre vendedores y compradores.
                                        </p>
                                        <p className="mb-2">
                                            2. LA TIENDA es la única responsable de la veracidad, calidad, existencia y legalidad de los productos ofrecidos.
                                        </p>
                                        <p className="mb-2">
                                            3. ParatodosIA queda exenta de cualquier responsabilidad civil, penal o administrativa derivada de las transacciones realizadas.
                                        </p>
                                        <p className="mb-2">
                                            4. LA TIENDA se compromete a cumplir con todas las normativas legales vigentes en materia de comercio electrónico y protección al consumidor.
                                        </p>
                                        <p className="mb-2">
                                            5. El incumplimiento de cualquiera de estas cláusulas resultará en la suspensión inmediata de la cuenta.
                                        </p>
                                        <p>
                                            Al hacer clic en &quot;Aceptar y Crear Tienda&quot;, usted firma digitalmente este acuerdo.
                                        </p>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-lg">
                                        <Checkbox
                                            id="terms"
                                            name="terms"
                                            checked={termsAccepted}
                                            onCheckedChange={(c: boolean | "indeterminate") => setTermsAccepted(c === true)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Acepto el contrato de responsabilidad y los términos de servicio.
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                Entiendo que soy responsable de las ventas realizadas.
                                            </p>
                                        </div>
                                    </div>

                                    {state.message && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                            {state.message}
                                        </div>
                                    )}
                                    {Object.keys(state.errors || {}).length > 0 && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                                            Por favor corrige los errores en los pasos anteriores.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-zinc-800 pt-6">
                    <Button
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || isPending}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                        Atrás
                    </Button>

                    <Button
                        onClick={() => step === 6 ? (document.getElementById('wizard-form') as HTMLFormElement)?.requestSubmit() : handleNext()}
                        disabled={!isStepValid() || isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando...
                            </>
                        ) : (
                            <>
                                {step === 6 ? "Aceptar y Crear" : "Siguiente"}
                                {step !== 6 && <ArrowRight className="ml-2 h-4 w-4" />}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
