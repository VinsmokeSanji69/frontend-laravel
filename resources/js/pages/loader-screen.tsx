import { WandSparkles } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";

export default function LoaderDots() {
    const wandControls = useAnimation();
    const [step, setStep] = useState(0);

    const steps = [
        "Extracting File",
        "Generating Test Questions",
        "Finalizing Exam Sheet",
    ];

    useEffect(() => {
        wandControls.start({
            y: [0, -10, 0],
            rotate: [0, 20, -20, 0],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        });


        const interval = setInterval(() => {
            setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 5000); // 5s per step


        return () => clearInterval(interval);
    }, [wandControls]);

    return (
        <AppLayout>
            <div className="flex items-center justify-center w-screen h-screen bg-background">
                <motion.div className="card text-center transition-shadow px-4 py-12 border-foreground">
                    <motion.div
                        className="w-20 h-20 flex items-center justify-center mx-auto mb-4"
                        animate={wandControls}
                    >
                        <WandSparkles className="h-14 w-14" />
                    </motion.div>
                    <h1 className="text-2xl font-medium mb-2">
                        {steps[step]}
                    </h1>
                </motion.div>
            </div>
        </AppLayout>
    );
}
