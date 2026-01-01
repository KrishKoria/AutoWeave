"use client";

import { motion } from "framer-motion";
import { Workflow, Bot, Webhook, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { staggerContainer, fadeInUp } from "./animations";

const features = [
  {
    icon: Workflow,
    title: "Visual Workflow Editor",
    description: "Drag-and-drop interface to build complex automation pipelines visually.",
  },
  {
    icon: Bot,
    title: "AI Integration",
    description: "Built-in support for OpenAI, Claude, Gemini, and DeepSeek models.",
  },
  {
    icon: Webhook,
    title: "Webhook Triggers",
    description: "Automatically run workflows from Google Forms, Stripe, and more.",
  },
  {
    icon: Zap,
    title: "Real-Time Execution",
    description: "Watch your workflows execute live with real-time status updates.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-heading" className="bg-muted/30 px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 id="features-heading" className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Automate
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Powerful features to help you build and manage your automation workflows effortlessly.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-0 bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
