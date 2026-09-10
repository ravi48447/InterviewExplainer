"use client";

import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/motion-wrapper";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="px-4 py-16 sm:py-20 lg:px-6 bg-muted/20">
      <div className="mx-auto max-w-lg text-center">
        <FadeInUp>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Ready to start preparing?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground text-pretty">
            Join engineers who prepare smarter with structured paths.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              className="h-11 gap-2 rounded-xl px-7 text-sm font-medium shadow-lg shadow-primary/15 transition-all hover:shadow-xl hover:shadow-primary/25"
            >
              Start Guided Interview Prep
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
