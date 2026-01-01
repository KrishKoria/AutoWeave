"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingElement } from "./animations";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 pt-20 text-center">
      {/* Animated background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingElement duration={8} yOffset={30} className="absolute -left-40 -top-40">
          <div className="h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        </FloatingElement>
        <FloatingElement duration={10} yOffset={25} className="absolute -bottom-40 -right-40">
          <div className="h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        </FloatingElement>
        <FloatingElement duration={12} yOffset={20} className="absolute left-1/2 top-1/4 -translate-x-1/2">
          <div className="h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
        </FloatingElement>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Animated headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Automate Your Workflows{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            with AI
          </motion.span>
        </motion.h1>

        {/* Animated subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Build powerful automation pipelines visually. Connect AI models, webhooks,
          and APIs—no code required.
        </motion.p>

        {/* Animated CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button asChild size="lg" className="min-w-[180px]">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link href="#features">See How It Works</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <div className="h-6 w-4 rounded-full border-2 border-muted-foreground/30 p-0.5">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
