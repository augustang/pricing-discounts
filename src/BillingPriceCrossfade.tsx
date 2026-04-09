import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import styles from "./PricingPage.module.css";

export function BillingPriceCrossfade({
  presenceKey,
  reduceMotion,
  className,
  priceRow,
  savings,
}: {
  presenceKey: string;
  reduceMotion: boolean;
  className?: string;
  priceRow: ReactNode;
  /** Omit or pass null to hide the savings line (prototype toolbar) */
  savings: ReactNode | null;
}) {
  const durationEnter = reduceMotion ? 0.12 : 0.75;
  const durationExit = reduceMotion ? 0.12 : 0.25;
  const stagger = reduceMotion ? 0 : 0.3;
  const billingFadeEase = "linear" as const;

  const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0,
      },
    },
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: durationExit, ease: billingFadeEase },
    },
    visible: {
      opacity: 1,
      transition: { duration: durationEnter, ease: billingFadeEase },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={presenceKey}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div variants={itemVariants} className={styles.priceRow}>
          {priceRow}
        </motion.div>
        {savings != null && savings !== "" ? (
          <motion.p variants={itemVariants} className={styles.savings}>
            {savings}
          </motion.p>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
