"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Heart } from "lucide-react";
import { fadeInUp } from "./animations";

export function LandingFooter() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="border-t bg-card px-4 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo and Copyright */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/icons/logo.svg"
                  alt="AutoWeave"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </motion.div>
              <span className="font-semibold text-foreground">AutoWeave</span>
            </Link>
          </motion.div>

          {/* Copyright with heart */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            © 2026 AutoWeave. Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-3 w-3 fill-destructive text-destructive" />
            </motion.span>
          </motion.p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://github.com/KrishKoria/AutoWeave"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only md:not-sr-only">GitHub</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
