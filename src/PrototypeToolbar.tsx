import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./PrototypeToolbar.module.css";

export type PromoVariant = 1 | 2 | 3 | 4;
export type CtaVariant = 1 | 2 | 3 | 4;

export type PrototypeToolbarProps = {
  /** Top promo banner + 20% promotional pricing display */
  activePromo: boolean;
  onActivePromoChange: (v: boolean) => void;
  /** Combined badge + inline struck original price; main number shows discounted */
  badgeWithStrike: boolean;
  onBadgeWithStrikeChange: (v: boolean) => void;
  ctaVariant: CtaVariant;
  onCtaVariantChange: (v: CtaVariant) => void;
  promoVariant: PromoVariant;
  onPromoVariantChange: (v: PromoVariant) => void;
};

const TRIGGER_ZONE_PX = 48;

export function PrototypeToolbar({
  activePromo,
  onActivePromoChange,
  badgeWithStrike,
  onBadgeWithStrikeChange,
  ctaVariant,
  onCtaVariantChange,
  promoVariant,
  onPromoVariantChange,
}: PrototypeToolbarProps) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const hoveringBar = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const inTriggerZone =
      e.clientY >= window.innerHeight - TRIGGER_ZONE_PX;
    if (inTriggerZone) {
      setVisible(true);
    } else if (!hoveringBar.current) {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.aside
      ref={barRef}
      className={styles.bar}
      aria-label="Prototype"
      initial={{ y: "calc(100% + 24px)" }}
      animate={{ y: visible ? 0 : "calc(100% + 24px)" }}
      transition={{ type: "spring", damping: 30, stiffness: 170, mass: 1.2 }}
      onMouseEnter={() => {
        hoveringBar.current = true;
        setVisible(true);
      }}
      onMouseLeave={() => {
        hoveringBar.current = false;
        setVisible(false);
      }}
    >
      <div className={styles.group}>
        <p className={styles.groupLabel}>Active promo</p>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={activePromo}
            onChange={(e) => onActivePromoChange(e.target.checked)}
          />
          <span>On</span>
        </label>
      </div>

      <div className={styles.group}>
        <p className={styles.groupLabel}>UI elements</p>
        <div className={styles.row}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={badgeWithStrike}
              onChange={(e) => onBadgeWithStrikeChange(e.target.checked)}
            />
            <span>Strike</span>
          </label>
        </div>
      </div>

      <fieldset className={styles.group} aria-labelledby="proto-toolbar-promo">
        <p className={styles.groupLabel} id="proto-toolbar-promo">
          Promo
        </p>
        <div className={styles.heroRadios}>
          {([1, 2, 3, 4] as const).map((n) => (
            <label key={n} className={styles.radioLabel}>
              <input
                type="radio"
                name="prototype-promo"
                checked={promoVariant === n}
                onChange={() => onPromoVariantChange(n)}
              />
              <span>{String(n).padStart(2, "0")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group} aria-labelledby="proto-toolbar-cta">
        <p className={styles.groupLabel} id="proto-toolbar-cta">
          CTA
        </p>
        <div className={styles.heroRadios}>
          {([1, 2, 3, 4] as const).map((n) => (
            <label key={n} className={styles.radioLabel}>
              <input
                type="radio"
                name="prototype-cta"
                checked={ctaVariant === n}
                onChange={() => onCtaVariantChange(n)}
              />
              <span>{String(n).padStart(2, "0")}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </motion.aside>
  );
}
