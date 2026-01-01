"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "./animations";

const aiProviders = [
  { name: "OpenAI", logo: "/icons/openai.svg" },
  { name: "Anthropic", logo: "/icons/anthropic.svg" },
  { name: "Google Gemini", logo: "/icons/gemini.svg" },
  { name: "DeepSeek", logo: "/icons/deepseek.svg" },
];

const triggers = [
  { name: "Stripe", logo: "/icons/stripe.svg" },
  { name: "Google Forms", logo: "/icons/googleform.svg" },
];

export function IntegrationsSection() {
  return (
    <section className="bg-muted/30 px-4 py-20 md:py-24">
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
            Powerful Integrations
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Connect with leading AI providers and trigger your workflows from anywhere.
          </p>
        </motion.div>

        {/* AI Providers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            AI Providers
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {aiProviders.map((provider, index) => (
              <motion.div
                key={provider.name}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-2"
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="flex h-16 w-16 items-center justify-center rounded-xl bg-card p-3 shadow-sm transition-shadow group-hover:shadow-lg"
                >
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain dark:invert"
                  />
                </motion.div>
                <span className="text-xs text-muted-foreground">{provider.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Triggers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Triggers
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {triggers.map((trigger, index) => (
              <motion.div
                key={trigger.name}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-2"
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="flex h-16 w-16 items-center justify-center rounded-xl bg-card p-3 shadow-sm transition-shadow group-hover:shadow-lg"
                >
                  <Image
                    src={trigger.logo}
                    alt={trigger.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain dark:invert"
                  />
                </motion.div>
                <span className="text-xs text-muted-foreground">{trigger.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
