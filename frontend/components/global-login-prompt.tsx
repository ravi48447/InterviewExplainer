"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

export function GlobalLoginPrompt() {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the prompt or is logged in
    const hasSeenPrompt = localStorage.getItem("ie_login_prompt_seen");
    
    if (user || hasSeenPrompt) return;

    // Show login popup after 5 minutes (300,000 ms)
    const timer = setTimeout(() => {
      if (!user) {
        setShowModal(true);
        localStorage.setItem("ie_login_prompt_seen", "true");
      }
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [user]);

  if (user || !showModal) return null;

  return (
    <AuthModal
      open={showModal}
      onClose={() => setShowModal(false)}
      title="Create an account to save your progress"
      subtitle="Join InterviewExplainer to track your learning, save bookmarks, and more."
    />
  );
}
