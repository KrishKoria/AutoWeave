"use client";

import { motion } from "framer-motion";
import { Monitor, Play } from "lucide-react";
import { fadeInUp, FloatingElement } from "./animations";

export function ShowcaseSection() {
  return (
    <section className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Build Workflows Visually
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Create complex automations with our intuitive drag-and-drop editor.
            Connect nodes, configure triggers, and deploy in minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Placeholder for workflow editor screenshot/illustration */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="overflow-hidden rounded-xl border bg-card shadow-lg"
          >
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="h-3 w-3 rounded-full bg-destructive/60"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="h-3 w-3 rounded-full bg-yellow-500/60"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="h-3 w-3 rounded-full bg-primary/60"
              />
              <span className="ml-2 text-sm text-muted-foreground">AutoWeave Editor</span>
            </div>
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50 p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <FloatingElement duration={4} yOffset={10}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg">
                    <Monitor className="h-10 w-10 text-primary" />
                  </div>
                </FloatingElement>
                <div>
                  <p className="mb-1 font-semibold text-foreground">Visual Workflow Editor</p>
                  <p className="text-sm text-muted-foreground">
                    Drag nodes, connect pipelines, and watch your automation come to life
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Play className="h-4 w-4" />
                  Watch Demo
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}
