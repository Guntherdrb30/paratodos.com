import { StoreCreationWizard } from "@/components/demo/StoreCreationWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crea tu Tienda | ParatodosIA",
    description: "Comienza a vender en línea en minutos con ParatodosIA.",
};

export default function RegisterPage() {
    return (
        // The Wizard component handles its own layout and centering
        <StoreCreationWizard />
    );
}
