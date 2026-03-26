"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { markQuestionComplete } from "@/lib/api";
import { useRouter } from "next/navigation";

export function MarkCompleteButton({ questionId }: { questionId: number }) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const router = useRouter();

    const handleComplete = async () => {
        setLoading(true);
        try {
            await markQuestionComplete(questionId);
            setCompleted(true);
            router.refresh(); // Refresh server components to potentially show updated status if we were fetching it
        } catch (error) {
            console.error("Failed to mark complete", error);
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <Button variant="secondary" disabled className="gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Completed
            </Button>
        );
    }

    return (
        <Button onClick={handleComplete} disabled={loading} className="gap-2">
            {loading ? "Saving..." : "Mark as Completed"}
        </Button>
    );
}
