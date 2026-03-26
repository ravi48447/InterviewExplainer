import SelectionWizard from "@/components/selection-wizard";

export default function SelectPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Background Blobs */}
            <div className="bg-blob bg-primary/10 top-[20%] right-[-5%]" />
            <div className="bg-blob bg-blue-500/10 bottom-[10%] left-[-5%] delay-700" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20" />

            <main className="container relative z-10 mx-auto px-4 pt-20 pb-16">
                <SelectionWizard />
            </main>
        </div>
    );
}
