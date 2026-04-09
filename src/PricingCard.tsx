import { animate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BillingPriceCrossfade } from "./BillingPriceCrossfade";
import type { DisplayPrice } from "./pricingDisplay";
import { discountedAmount20, formatUsd } from "./pricingDisplay";
import type { CtaVariant } from "./PrototypeToolbar";
import styles from "./PricingPage.module.css";

/** Slash-through: animates a line across the base price and fades in the discounted price beside it. */
function HoverSlashPrice({
  baseAmount,
  showDiscounted,
  reduceMotion,
  fadeOut = false,
}: {
  baseAmount: number;
  showDiscounted: boolean;
  reduceMotion: boolean;
  /** When true, the discounted price fades out on hover-off instead of being masked by max-width. */
  fadeOut?: boolean;
}) {
  const discounted = discountedAmount20(baseAmount);
  const instant = reduceMotion ? ` ${styles.hoverSlashInstant}` : "";
  const struck = showDiscounted ? ` ${styles.hoverSlashBaseStruck}` : "";
  const visible = showDiscounted ? ` ${styles.hoverSlashDiscountVisible}` : "";
  const fadeOffCls = fadeOut ? ` ${styles.hoverSlashDiscountFadeOff}` : "";

  return (
    <span className={`${styles.hoverSlashSlot}${instant}`}>
      <span className={`${styles.hoverSlashBase}${struck}`}>
        {formatUsd(baseAmount)}
        <span className={styles.hoverSlashLine} />
      </span>
      <span className={`${styles.hoverSlashDiscount}${fadeOffCls}${visible}`}>
        {formatUsd(discounted)}
      </span>
    </span>
  );
}

/** Stat-style ticker: counts down from list price to 20% off on hover, back up on leave (see squarespace.com hero stats). */
function HoverTickerPrice({
  baseAmount,
  showDiscounted,
  reduceMotion,
}: {
  baseAmount: number;
  showDiscounted: boolean;
  reduceMotion: boolean;
}) {
  const discountedAmount = discountedAmount20(baseAmount);
  const [display, setDisplay] = useState(baseAmount);
  const displayRef = useRef(baseAmount);

  const baseStr = formatUsd(baseAmount);
  const discStr = formatUsd(discountedAmount);
  const measureStr = baseStr.length >= discStr.length ? baseStr : discStr;

  useEffect(() => {
    const target = showDiscounted ? discountedAmount : baseAmount;
    const start = displayRef.current;
    if (Math.round(start) === target) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }

    const duration = reduceMotion ? 0.06 : 0.72;
    const controls = animate(start, target, {
      duration,
      ease: [0.2, 0.85, 0.15, 1],
      onUpdate: (v) => {
        const r = Math.round(v);
        displayRef.current = r;
        setDisplay(r);
      },
      onComplete: () => {
        displayRef.current = target;
        setDisplay(target);
      },
    });
    return () => controls.stop();
  }, [showDiscounted, baseAmount, discountedAmount, reduceMotion]);

  return (
    <span className={styles.hoverPriceTickerSlot} aria-live="polite">
      <span className={styles.hoverPriceTickerMeasure} aria-hidden>
        {measureStr}
      </span>
      <span className={styles.hoverPriceTickerValue}>{formatUsd(display)}</span>
    </span>
  );
}

type Plan = {
  name: string;
  desc: string;
  recommended: boolean;
  ideal: { icon: string; text: string }[];
  features: { icon: string; text: string }[];
  idealTitle: string;
  featuresTitle: string;
};

export type PricingPlanCardProps = {
  plan: Plan;
  displayPrice: DisplayPrice;
  baseAmount: number;
  showPromoBadge: boolean;
  /** Badge shows label + struck original price; main number = 20%-off amount */
  badgeWithStrike: boolean;
  /** Promo on — list price shown; hover can preview 20% off */
  hoverDiscountAllowed: boolean;
  ctaVariant: CtaVariant;
  presenceKey: string;
  reduceMotion: boolean;
  showAnnualSavings: boolean;
  promoBadgeLabel: string;
};

export function PricingPlanCard({
  plan,
  displayPrice: pr,
  baseAmount,
  showPromoBadge,
  badgeWithStrike,
  hoverDiscountAllowed,
  ctaVariant,
  presenceKey,
  reduceMotion,
  showAnnualSavings,
  promoBadgeLabel,
}: PricingPlanCardProps) {
  const [buttonHover, setButtonHover] = useState(false);

  const hoverModeEnabled = (ctaVariant === 3 || ctaVariant === 4) && hoverDiscountAllowed;
  const hoverDiscountVisual = hoverModeEnabled && buttonHover;

  const onBuyEnter = useCallback(() => {
    if (hoverModeEnabled) setButtonHover(true);
  }, [hoverModeEnabled]);

  const onBuyLeave = useCallback(() => setButtonHover(false), []);

  const priceRow =
    badgeWithStrike ? (
      <p className={styles.priceMain}>
        {formatUsd(discountedAmount20(baseAmount))}
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : ctaVariant === 4 && hoverDiscountAllowed ? (
      <p className={styles.priceMain}>
        <HoverSlashPrice
          baseAmount={baseAmount}
          showDiscounted={hoverDiscountVisual}
          reduceMotion={reduceMotion}
          fadeOut
        />
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : ctaVariant === 3 && hoverDiscountAllowed ? (
      <p className={styles.priceMain}>
        <HoverTickerPrice
          key={`hover-ticker-${baseAmount}`}
          baseAmount={baseAmount}
          showDiscounted={hoverDiscountVisual}
          reduceMotion={reduceMotion}
        />
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : (
      <p className={styles.priceMain}>
        {pr.price}
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    );

  return (
    <article className={`${styles.card} ${plan.recommended ? styles.cardRecommended : ""}`}>
      <div className={styles.cardMain}>
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{plan.name}</h2>
            {plan.recommended ? <span className={styles.badge}>Recommended</span> : null}
          </div>
          <div className={styles.cardPriceStack}>
            {badgeWithStrike ? (
              <span className={`${styles.discountPill} fsText fsText--footnote`}>
                <span className={styles.badgeStrikePrice}>{formatUsd(baseAmount)}</span>
                {promoBadgeLabel}
              </span>
            ) : showPromoBadge ? (
              <span className={`${styles.discountPill} fsText fsText--footnote`}>
                {promoBadgeLabel}
              </span>
            ) : null}
            <BillingPriceCrossfade
              presenceKey={presenceKey}
              reduceMotion={reduceMotion}
              className={styles.billingPriceCrossfade}
              priceRow={priceRow}
              savings={showAnnualSavings ? pr.savings : null}
            />
          </div>
          <p className={styles.cardDesc}>{plan.desc}</p>
        </div>
        <div className={styles.cardCtas}>
          <button
            type="button"
            className={`${styles.btnPrimary} ${ctaVariant === 3 && hoverDiscountAllowed ? styles.btnPrimaryHasHoverHint : ""}`}
            onMouseEnter={onBuyEnter}
            onMouseLeave={onBuyLeave}
          >
            {ctaVariant === 2 || ctaVariant === 4 ? (
              <>Buy now{hoverDiscountAllowed && <> &nbsp;&middot;&nbsp; 20% off</>}</>
            ) : ctaVariant === 3 && hoverDiscountAllowed ? (
              <span className={styles.btnPrimaryHoverRow}>
                <span className={styles.btnPrimaryMain}>Buy now</span>
                <span
                  className={`${styles.btnPrimaryDiscountHint} ${reduceMotion ? styles.btnPrimaryDiscountHintInstant : ""}`}
                  aria-hidden
                >
                  20% off
                </span>
              </span>
            ) : (
              "Buy now"
            )}
          </button>
          <button type="button" className={styles.btnOutline}>
            start free trial
          </button>
        </div>
        <div>
          <h3 className={styles.sectionLabel}>{plan.idealTitle}</h3>
          <ul className={styles.featureList}>
            {plan.ideal.map((row) => (
              <li key={row.text}>
                <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                  <img src={row.icon} alt="" />
                </span>
                {row.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.sectionLabel}>{plan.featuresTitle}</h3>
          <ul className={styles.featureList}>
            {plan.features.map((row) => (
              <li key={row.text}>
                <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                  <img src={row.icon} alt="" />
                </span>
                {row.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button type="button" className={styles.compareLink}>
        See and compare all features
      </button>
    </article>
  );
}

export type AdvancedPricingCardProps = {
  name: string;
  blurb: string;
  ideal: { icon: string; text: string }[];
  displayPrice: DisplayPrice;
  baseAmount: number;
  showPromoBadge: boolean;
  badgeWithStrike: boolean;
  hoverDiscountAllowed: boolean;
  ctaVariant: CtaVariant;
  presenceKey: string;
  reduceMotion: boolean;
  showAnnualSavings: boolean;
  promoBadgeLabel: string;
};

export function AdvancedPricingCard({
  name,
  blurb,
  ideal,
  displayPrice: pr,
  baseAmount,
  showPromoBadge,
  badgeWithStrike,
  hoverDiscountAllowed,
  ctaVariant,
  presenceKey,
  reduceMotion,
  showAnnualSavings,
  promoBadgeLabel,
}: AdvancedPricingCardProps) {
  const [buttonHover, setButtonHover] = useState(false);

  const hoverModeEnabled = (ctaVariant === 3 || ctaVariant === 4) && hoverDiscountAllowed;
  const hoverDiscountVisual = hoverModeEnabled && buttonHover;

  const onBuyEnter = useCallback(() => {
    if (hoverModeEnabled) setButtonHover(true);
  }, [hoverModeEnabled]);

  const onBuyLeave = useCallback(() => setButtonHover(false), []);

  const priceRow =
    badgeWithStrike ? (
      <p className={styles.priceMain}>
        {formatUsd(discountedAmount20(baseAmount))}
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : ctaVariant === 4 && hoverDiscountAllowed ? (
      <p className={styles.priceMain}>
        <HoverSlashPrice
          baseAmount={baseAmount}
          showDiscounted={hoverDiscountVisual}
          reduceMotion={reduceMotion}
          fadeOut
        />
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : ctaVariant === 3 && hoverDiscountAllowed ? (
      <p className={styles.priceMain}>
        <HoverTickerPrice
          key={`hover-ticker-${baseAmount}`}
          baseAmount={baseAmount}
          showDiscounted={hoverDiscountVisual}
          reduceMotion={reduceMotion}
        />
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    ) : (
      <p className={styles.priceMain}>
        {pr.price}
        <span className={styles.priceSuffix}>/mo</span>
      </p>
    );

  return (
    <article className={`${styles.card} ${styles.advancedCard}`}>
      <div className={styles.cardInfo}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{name}</h2>
        </div>
        <div className={styles.cardPriceStack}>
          {badgeWithStrike ? (
            <span className={`${styles.discountPill} fsText fsText--footnote`}>
              <span className={styles.badgeStrikePrice}>{formatUsd(baseAmount)}</span>
              {promoBadgeLabel}
            </span>
          ) : showPromoBadge ? (
            <span className={`${styles.discountPill} fsText fsText--footnote`}>
              {promoBadgeLabel}
            </span>
          ) : null}
          <BillingPriceCrossfade
            presenceKey={presenceKey}
            reduceMotion={reduceMotion}
            className={styles.billingPriceCrossfade}
            priceRow={priceRow}
            savings={showAnnualSavings ? pr.savings : null}
          />
        </div>
      </div>
      <div className={styles.advancedMid}>
        <h3 className={styles.sectionLabel}>Ideal plan for</h3>
        <ul className={styles.featureList}>
          {ideal.map((row) => (
            <li key={row.text}>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={row.icon} alt="" />
              </span>
              {row.text}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.advancedCol}>
        <p className={styles.cardDesc} style={{ maxWidth: "none" }}>
          {blurb}
        </p>
        <div className={styles.advancedActions}>
          <button
            type="button"
            className={`${styles.btnPrimary} ${ctaVariant === 3 && hoverDiscountAllowed ? styles.btnPrimaryHasHoverHint : ""}`}
            onMouseEnter={onBuyEnter}
            onMouseLeave={onBuyLeave}
          >
            {(ctaVariant === 2 || ctaVariant === 4) && hoverDiscountAllowed ? (
              <>Buy now &nbsp;&middot;&nbsp; 20% off</>
            ) : ctaVariant === 3 && hoverDiscountAllowed ? (
              <span className={styles.btnPrimaryHoverRow}>
                <span className={styles.btnPrimaryMain}>Buy now</span>
                <span
                  className={`${styles.btnPrimaryDiscountHint} ${reduceMotion ? styles.btnPrimaryDiscountHintInstant : ""}`}
                  aria-hidden
                >
                  20% off
                </span>
              </span>
            ) : (
              "Buy now"
            )}
          </button>
          <button type="button" className={styles.btnOutline}>
            start free trial
          </button>
        </div>
      </div>
    </article>
  );
}
