"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "./animations";

const pricingTiers = [
  {
    name: "Free",
    price: "Free",
    description: "Get started with basic automation",
    features: [
      "3 workflows",
      "Manual execution only",
      "Basic node types",
      "Community support",
    ],
    cta: { text: "Get Started", href: "/signup", variant: "outline" as const },
    highlighted: false,
  },
  {
    name: "Plus",
    price: "$10/mo",
    description: "For power users and small teams",
    features: [
      "Unlimited workflows",
      "Webhook triggers",
      "All AI providers",
      "Execution history",
      "Email support",
    ],
    cta: { text: "Upgrade to Plus", href: "/signup", variant: "default" as const },
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$25/mo",
    description: "For businesses and advanced users",
    features: [
      "Everything in Plus",
      "Priority execution",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
    cta: { text: "Upgrade to Pro", href: "/signup", variant: "secondary" as const },
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 id="pricing-heading" className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: tier.highlighted ? -12 : -8, scale: tier.highlighted ? 1.03 : 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col",
                    tier.highlighted && "border-primary shadow-lg ring-2 ring-primary/20"
                  )}
                >
                  {tier.highlighted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </span>
                    </motion.div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className="mt-2"
                    >
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    </motion.div>
                    <CardDescription className="mt-2">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + featureIndex * 0.05 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button asChild variant={tier.cta.variant} className="w-full">
                        <Link href={tier.cta.href}>{tier.cta.text}</Link>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
