"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import apiClient from "@/lib/api-client";
import { addGuestCompleted, getGuestCompleted } from "@/lib/guest-progress";
import { AuthModal } from "@/components/auth/auth-modal";

export function MarkCompleteButton({ questionId }: { questionId: number }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(
        () => !user && typeof window !== "undefined" && getGuestCompleted().includes(questionId),
    );
    const [authOpen, setAuthOpen] = useState(false);
    const router = useRouter();

    // No DB question ID available — can't track progress
    if (!questionId || questionId <= 0) return null;

    if (completed) {
        return (
            <Button variant="secondary" disabled className="gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                Completed
            </Button>
        );
    }

    const handleComplete = async () => {
        // Anonymous: record locally and nudge to create an account (syncs later).
        if (!user) {
            addGuestCompleted(questionId);
            setCompleted(true);
            setAuthOpen(true);
            return;
        }
        setLoading(true);
        try {
            await apiClient.post(`/progress/question/${questionId}/complete`);
            setCompleted(true);
            router.refresh();
        } catch (error) {
            console.error("Failed to mark complete", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleComplete}
                disabled={loading}
                className="gap-2 bg-emerald-600 dark:bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-800 text-white"
            >
                <CheckCircle className="h-4 w-4" />
                {loading ? "Saving..." : "Mark as Completed"}
            </Button>
            <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                title="Progress saved — make it count"
                subtitle="Create a free account to keep your streak, progress and readiness score."
            />
        </>
    );
}
