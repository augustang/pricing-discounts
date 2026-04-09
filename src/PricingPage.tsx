import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { assets } from "./assets/paths";
import { AdvancedPricingCard, PricingPlanCard } from "./PricingCard";
import {
  ADVANCED_RATES,
  PLAN_RATES,
  planBaseAmount,
  planDisplayPrices,
  type Billing,
} from "./pricingDisplay";
import { PrototypeToolbar, type CtaVariant, type PromoVariant } from "./PrototypeToolbar";
import styles from "./PricingPage.module.css";

/** Copy for Advanced blue savings line (listed %, not derived from list prices) */
const ADVANCED_ANNUAL_SAVINGS_PCT_DISPLAY = 28;

const PROMO_BADGE_LABELS: Record<PromoVariant, string> = {
  1: "Buy now for 20% off",
  2: "Take 20% off at checkout",
  3: "20% off at checkout",
  4: "Limited time 20% off",
  5: "20% off",
};

const HERO_TITLE = "Beautiful websites";
const HERO_SUB = "Free for 14 days.";
const HERO_SUB_ACCENT = "Pay annually to save up to 36%.";


const comparisonRows: { feature: string; cells: string[] }[] = [
  { feature: "Contributors", cells: ["2", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Squarespace AI", cells: ["✓", "✓", "✓", "✓"] },
  { feature: "Free custom domain", cells: ["✓", "✓", "✓", "✓"] },
  { feature: "SSL security", cells: ["✓", "✓", "✓", "✓"] },
  { feature: "Video storage", cells: ["—", "30 min", "5 hrs", "50 hrs"] },
  { feature: "Transaction fees", cells: ["3%", "0%", "0%", "0%"] },
];

const faqItems: { q: string; a: string }[] = [
  {
    q: "How does the 14-day free trial work?",
    a: "Start building immediately. We do not require a credit card to begin, and you can publish when you are ready.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle unless you choose to apply them immediately where available.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards. Availability of additional methods may vary by region.",
  },
  {
    q: "Do plans include email?",
    a: "Professional email through Google Workspace is included on select plans. See plan details for eligibility and limits.",
  },
  {
    q: "Is there a discount for paying annually?",
    a: "Yes. Annual billing includes savings compared to paying month-to-month, as shown on this page.",
  },
  {
    q: "What happens when my trial ends?",
    a: "You can choose a paid plan to keep your site live. If you do not subscribe, your trial site will be paused according to our terms.",
  },
];

const footerLinks: { title: string; links: string[] }[] = [
  {
    title: "Products",
    links: [
      "Website Templates",
      "Websites",
      "Domains",
      "Design Intelligence",
      "Online Stores",
      "Services",
      "Invoicing",
      "Scheduling",
      "Content & Memberships",
      "Donations",
      "Payments",
      "Marketing Tools",
      "Email Campaigns",
      "Professional Email",
      "Feature List",
      "Pricing",
    ],
  },
  {
    title: "Solutions",
    links: [
      "Customer Examples",
      "Squarespace Collection",
      "Fitness",
      "Beauty",
      "Photography",
      "Restaurants",
      "Art & Design",
      "Wedding",
      "Creators",
      "Enterprise",
    ],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Forum",
      "Webinars",
      "Hire an Expert",
      "Developer Blog",
      "Developer Platform",
      "System Status",
    ],
  },
  {
    title: "Resources",
    links: ["Extensions", "Squarespace Blog", "Business Name Generator", "Logo Maker"],
  },
  {
    title: "Company",
    links: [
      "About",
      "Careers",
      "Investor Relations",
      "Our History",
      "Our Brand",
      "Accessibility",
      "Newsroom",
      "Press & Media",
      "Contact Us",
    ],
  },
];

export function PricingPage() {
  const [billing, setBilling] = useState<Billing>("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [localPromoVisible, setLocalPromoVisible] = useState(true);
  const showToolbar = true;
  const [toolbarProto, setToolbarProto] = useState({
    activePromo: true,
    ctaVariant: 4 as CtaVariant,
    promoVariant: 4 as PromoVariant,
  });

  const proto = showToolbar
    ? toolbarProto
    : {
        ctaVariant: 2 as CtaVariant,
        promoVariant: 2 as PromoVariant,
      };

  const promoVisible = showToolbar ? toolbarProto.activePromo : localPromoVisible;
  const showDiscount = showToolbar ? toolbarProto.activePromo : false;
  /** CTA 01/02 → badge+strike on; CTA 03/04 → badge+strike off */
  const badgeWithStrike = showDiscount && (proto.ctaVariant === 1 || proto.ctaVariant === 2);

  const discountAppliesToListedPrice = false;

  /** Hover preview (CTA 02): promo on, list price shown OR badge+strike (CTA hint only, no ticker) */
  const hoverDiscountAllowed = showDiscount;

  const showAnnualSavings = !showDiscount;
  const showPromoBadge = showDiscount && !badgeWithStrike;

  const promoBadgeLabel = PROMO_BADGE_LABELS[proto.promoVariant];

  const pricePresenceKey = `${billing}-${discountAppliesToListedPrice ? "1" : "0"}-${badgeWithStrike ? "b" : ""}`;
  const reduceMotion = useReducedMotion();
  const billingStickyEnter = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.75, ease: "linear" as const };
  const billingStickyExit = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.25, ease: "linear" as const };

  const plans = [
    {
      name: "Basic",
      desc: "Create your own custom website and get discovered online",
      recommended: false,
      ideal: [
        { icon: assets.checkBasic, text: "Personal websites, CVs, portfolios" },
        { icon: assets.checkBasic, text: "Freelancers & solo professionals" },
        { icon: assets.checkBasic, text: "Events or special projects" },
      ],
      features: [
        { icon: assets.iconWebsite, text: "Best in class Squarespace website" },
        { icon: assets.iconSearch, text: "SEO and site analytics" },
        { icon: assets.iconBank, text: "Accept payments, invoices and donations" },
        { icon: assets.iconClipboard, text: "Lead forms and email lists" },
        { icon: assets.iconBag, text: "Basic online store" },
      ],
      idealTitle: "Ideal plan for",
      featuresTitle: "Key features",
    },
    {
      name: "Core",
      desc: "Unlock our full array of business features as you grow your business",
      recommended: true,
      ideal: [
        { icon: assets.checkCore, text: "Professional service providers" },
        { icon: assets.checkCore, text: "Small businesses selling online" },
        { icon: assets.checkCore, text: "Local businesses" },
      ],
      features: [
        { icon: assets.iconBag, text: "Fully featured online store" },
        { icon: assets.iconImage, text: "Sell products, services, and digital content" },
        { icon: assets.iconPerson, text: "Pop-ups, banners, and audience insights" },
        { icon: assets.iconChart, text: "Advanced website and commerce analytics" },
        { icon: assets.iconMail, text: "Free Google Workspace professional email*" },
      ],
      idealTitle: "Ideal plan for",
      featuresTitle: "Includes all Basic features, and",
    },
    {
      name: "Plus",
      desc: "Enjoy lower payment processing fees as your business grows",
      recommended: false,
      ideal: [
        { icon: assets.checkPlus, text: "Established service businesses" },
        { icon: assets.checkPlus, text: "Growing online stores" },
        { icon: assets.checkPlus, text: "Small teams and agencies" },
      ],
      features: [
        { icon: assets.iconBankPlus, text: "Lowest payment processing rates" },
        { icon: assets.iconImagePlus, text: "1% fees on digital content and memberships" },
        { icon: assets.iconVideo, text: "50 hours of video hosting" },
      ],
      idealTitle: "Ideal plan for",
      featuresTitle: "Includes all Core features, and",
    },
  ];

  const advanced = {
    name: "Advanced",
    ideal: [
      { icon: assets.checkAdvanced, text: "High-volume online stores" },
      { icon: assets.checkAdvanced, text: "Scaling brands" },
      { icon: assets.checkAdvanced, text: "Advanced commerce operations" },
    ],
    blurb:
      "Includes all Plus plan features and more, offering the lowest fees and payment processing rates to optimize profits for sellers processing above 2.500€ per month.",
  };

  const priceFor = (p: (typeof plans)[0]) => {
    const rates = PLAN_RATES[p.name];
    if (!rates) {
      return { strike: "", price: "—", savings: "" };
    }
    return planDisplayPrices(rates, billing, discountAppliesToListedPrice);
  };
  const advPrice = planDisplayPrices(
    ADVANCED_RATES,
    billing,
    discountAppliesToListedPrice,
    ADVANCED_ANNUAL_SAVINGS_PCT_DISPLAY,
  );

  const dismissPromo = () => {
    if (showToolbar) {
      setToolbarProto((s) => ({ ...s, activePromo: false }));
    } else {
      setLocalPromoVisible(false);
    }
  };

  return (
    <div className={`${styles.page} fsText`}>
      <div className={styles.stickyHeader}>
        <div className={`${styles.promoWrap} ${promoVisible ? styles.promoWrapVisible : ""}`}>
          <header className={styles.promo}>
            <span aria-hidden="true" style={{ width: 32 }} />
            <div className={`${styles.promoCenter} fsText fsText--footnote fsText--light`}>
              <div className={styles.promoSentence}>
                <span>Take 20% off a new website plan. </span>
                <a className={styles.promoLink} href="#">
                  Buy now
                </a>
                <span> with code</span>
                <span className={styles.promoCode}>MAY20WE</span>
                <span> in checkout</span>
              </div>
              <span className={styles.iconSlot16} aria-hidden>
                <img src={assets.promoInfo} alt="" />
              </span>
            </div>
            <button
              type="button"
              className={styles.promoClose}
              aria-label="Close promotion"
              onClick={dismissPromo}
            />
          </header>
        </div>

        <div className={styles.navWrap}>
          <nav className={`${styles.nav} ${styles.inner}`}>
            <a className={styles.navBrand} href="/" aria-label="Squarespace home">
              <div className={styles.navLogo}>
                <img className={styles.navLogoLockup} src={assets.navLogoLockup} alt="Squarespace" />
                <img className={styles.navLogoMark} src={assets.navBug} alt="" aria-hidden />
              </div>
          </a>
          <div className={styles.navPrimary}>
            <button type="button" className={`${styles.navItem} fsText fsText--eyebrow`}>
              products{" "}
              <span className={`${styles.iconSlot16} ${styles.navChevronSlot}`} aria-hidden>
                <img src={assets.chevron} alt="" />
              </span>
            </button>
            <button type="button" className={`${styles.navItem} fsText fsText--eyebrow`}>
              Solutions{" "}
              <span className={`${styles.iconSlot16} ${styles.navChevronSlot}`} aria-hidden>
                <img src={assets.chevronAlt} alt="" />
              </span>
            </button>
            <button type="button" className={`${styles.navItem} fsText fsText--eyebrow`}>
              resources{" "}
              <span className={`${styles.iconSlot16} ${styles.navChevronSlot}`} aria-hidden>
                <img src={assets.chevron} alt="" />
              </span>
            </button>
          </div>
          <div className={styles.navActions}>
            <div className={styles.avatar} aria-hidden>
              S
            </div>
            <button type="button" className={styles.btnPrimaryFade}>
              Get started
            </button>
          </div>
          </nav>
        </div>
      </div>

      <section className={`${styles.hero} ${styles.inner}`}>
        <div className={styles.heroText}>
          <h1 className={`${styles.heroTitle} fsText fsText--title4`}>
            {HERO_TITLE}
          </h1>
          <p className={`${styles.heroSub} fsText fsText--body`}>
            {HERO_SUB}
            <span className={`${styles.heroSubAccent} ${promoVisible ? styles.heroSubAccentVisible : ""}`}>
              {HERO_SUB_ACCENT}
            </span>
          </p>
        </div>
        <div
          className={styles.billingToggle}
          role="radiogroup"
          aria-label="Billing period"
        >
          <div className={`${styles.togglePillBackground} ${billing === "monthly" ? styles.togglePillRight : ""}`} />
          <button
            type="button"
            role="radio"
            aria-checked={billing === "annual"}
            className={styles.billingToggleButton}
            onClick={() => setBilling("annual")}
          >
            <span className={styles.billingToggleLabel}>Pay annually</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={billing === "monthly"}
            className={styles.billingToggleButton}
            onClick={() => setBilling("monthly")}
          >
            <span className={styles.billingToggleLabel}>Pay monthly</span>
          </button>
        </div>
      </section>

      <section className={`${styles.strip} ${styles.inner}`}>
        <div className={styles.stripInner}>
          <span className={`${styles.stripLabel} fsText fsText--bodyMedium`}>All plans include:</span>
          <span className={styles.stripItem}>
            <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
              <img src={assets.includeMessage} alt="" />
            </span>
            Award-winning 24/7 support
          </span>
          <span className={styles.stripItem}>
            <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
              <img src={assets.includeAi} alt="" />
            </span>
            Squarespace AI
          </span>
          <span className={styles.stripItem}>
            <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
              <img src={assets.includeGlobal} alt="" />
            </span>
            Free custom domain*
          </span>
          <span className={styles.stripItem}>
            <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
              <img src={assets.includePerf} alt="" />
            </span>
            Unlimited bandwidth
          </span>
          <span className={styles.stripItem}>
            <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
              <img src={assets.includeStore} alt="" />
            </span>
            Sell products and services
          </span>
        </div>
      </section>

      <section className={`${styles.cardsSection} ${styles.inner}`}>
        <div className={styles.cardsRow}>
          {plans.map((plan) => {
            const rates = PLAN_RATES[plan.name];
            const pr = priceFor(plan);
            const baseAmount = rates ? planBaseAmount(rates, billing) : 0;
            return (
              <PricingPlanCard
                key={plan.name}
                plan={plan}
                displayPrice={pr}
                baseAmount={baseAmount}
                showPromoBadge={showPromoBadge}
                badgeWithStrike={badgeWithStrike}
                hoverDiscountAllowed={hoverDiscountAllowed}
                ctaVariant={proto.ctaVariant}
                presenceKey={pricePresenceKey}
                reduceMotion={!!reduceMotion}
                showAnnualSavings={showAnnualSavings}
                promoBadgeLabel={promoBadgeLabel}
              />
            );
          })}
        </div>

        <AdvancedPricingCard
          name={advanced.name}
          blurb={advanced.blurb}
          ideal={advanced.ideal}
          displayPrice={advPrice}
          baseAmount={planBaseAmount(ADVANCED_RATES, billing)}
          showPromoBadge={showPromoBadge}
          badgeWithStrike={badgeWithStrike}
          hoverDiscountAllowed={hoverDiscountAllowed}
          ctaVariant={proto.ctaVariant}
          presenceKey={pricePresenceKey}
          reduceMotion={!!reduceMotion}
          showAnnualSavings={showAnnualSavings}
          promoBadgeLabel={promoBadgeLabel}
        />
      </section>

      <section className={`${styles.compareSection} ${styles.inner}`}>
        <div className={styles.compareSticky}>
          <h2 className={styles.compareTitle}>Standout features</h2>
          {plans.map((plan) => {
            const pr = priceFor(plan);
            return (
              <div key={plan.name} className={styles.stickyCol}>
                <div className={styles.stickyPlanRow}>
                  <span className={styles.stickyPlan}>{plan.name}</span>
                  {plan.name === "Core" ? (
                    <img className={styles.stickyDot} src={assets.coreDot} alt="" />
                  ) : null}
                </div>
                <div>
                  <p className={styles.stickyPrice}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={pricePresenceKey}
                        className={styles.stickyPriceMotion}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: billingStickyEnter }}
                        exit={{ opacity: 0, transition: billingStickyExit }}
                      >
                        {pr.price}/mo
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
                <button type="button" className={styles.btnPrimary}>
                  Buy now
                </button>
              </div>
            );
          })}
          <div className={styles.stickyCol}>
            <div className={styles.stickyPlanRow}>
              <span className={styles.stickyPlan}>{advanced.name}</span>
            </div>
            <div>
              <p className={styles.stickyPrice}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={pricePresenceKey}
                    className={styles.stickyPriceMotion}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: billingStickyEnter }}
                    exit={{ opacity: 0, transition: billingStickyExit }}
                  >
                    {advPrice.price}/mo
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
            <button type="button" className={styles.btnPrimary}>
              Buy now
            </button>
          </div>
        </div>

        <div className={styles.table}>
          {comparisonRows.map((row) => (
            <div key={row.feature} className={styles.tableRow}>
              <div className={styles.tableFeature}>{row.feature}</div>
              {row.cells.map((cell, i) => (
                <div key={i} className={styles.tableCell}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.showAllRow}>
          <button type="button" className={styles.btnGhost}>
            Show all features
          </button>
        </div>
      </section>

      <section className={styles.sales}>
        <div className={styles.salesBg} aria-hidden />
        <div className={`${styles.salesContent} ${styles.inner}`}>
          <div>
            <h2 className={`${styles.salesHeadline} fsText fsText--subtitle1 fsText--light`}>
              Need a custom plan? Reach out to the sales team
            </h2>
            <button type="button" className={styles.btnWhite}>
              contact sales
            </button>
          </div>
          <ul className={styles.salesBullets}>
            <li>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={assets.salesCheck} alt="" />
              </span>
              For businesses of all sizes
            </li>
            <li>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={assets.salesCheck} alt="" />
              </span>
              Flexible & scalable pricing
            </li>
            <li>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={assets.salesCheck} alt="" />
              </span>
              Custom dashboard configuration
            </li>
            <li>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={assets.salesCheck} alt="" />
              </span>
              Admin purchasing
            </li>
            <li>
              <span className={`${styles.iconSlot16} ${styles.iconSlot16Comfort}`} aria-hidden>
                <img src={assets.salesCheck} alt="" />
              </span>
              Multi-website plans
            </li>
          </ul>
        </div>
        <div className={`${styles.logos} ${styles.inner}`}>
          {["Blink", "Barn2Door", "Netflix", "MNTN", "Raymond James", "SERHANT", "Dell", "YWCA"].map(
            (name) => (
              <span key={name}>{name}</span>
            ),
          )}
        </div>
      </section>

      <div className={styles.lowerDarkBand}>
      <section className={`${styles.showcaseIntro} ${styles.inner}`}>
        <h2 className="fsText fsText--subtitle1 fsText--light">
          Built by businesses like yours, on Squarespace
        </h2>
        <div>
          <p className="fsText fsText--body fsText--light">
            Find the inspiration for your next beautiful and functional website. Squarespace supports
            local businesses, restaurants, nonprofits, and more with essential features designed for
            services, online stores, blogs, and memberships.
          </p>
          <button type="button" className={styles.btnOutlineLight}>
            start free 14-day trial <span>→</span>
          </button>
        </div>
      </section>

      <section className={`${styles.gridSection} ${styles.inner}`}>
        <div className={styles.gridRows}>
          {[0, 1, 2].map((row) => (
            <div key={row} className={styles.gridRow}>
              <div className={styles.gridTiles}>
                {[1, 2, 3].map((col) => {
                  const n = row * 3 + col;
                  return (
                    <div key={n} className={styles.tile}>
                      <span className={styles.tileLabel}>Site example {n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.faq} ${styles.inner}`}>
        <h2 className={`${styles.faqTitle} fsText fsText--subtitle1 fsText--light`}>
          Frequently asked
          <br />
          questions
        </h2>
        <div className={styles.faqList}>
          {faqItems.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqButton}
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={styles.faqIcon} aria-hidden>
                    {open ? "×" : "+"}
                  </span>
                </button>
                {open ? <div className={styles.faqAnswer}>{item.a}</div> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className={`${styles.support} ${styles.inner}`}>
        <h2 className="fsText fsText--subtitle1 fsText--light">24/7 Support</h2>
        <div className={styles.supportCards}>
          <div className={styles.supportCard}>
            <div>
              <h3 className="fsText fsText--subtitle2 fsText--light">Help Center</h3>
              <p className="fsText fsText--body fsText--light">
                Get help any time from our Customer Care team.
              </p>
            </div>
            <span className={styles.supportArrow}>→</span>
          </div>
          <div className={styles.supportCard}>
            <div>
              <h3 className="fsText fsText--subtitle2 fsText--light">Webinars</h3>
              <p className="fsText fsText--body fsText--light">
                Free online sessions to learn the basics and refine your skills.
              </p>
            </div>
            <span className={styles.supportArrow}>→</span>
          </div>
        </div>
      </section>

      <section className={`${styles.conversion} ${styles.inner}`}>
        <h2 className="fsText fsText--title1 fsText--light">Start your free website trial today</h2>
        <div className={styles.conversionRow}>
          <button type="button" className={styles.btnWhite}>
            Get started
          </button>
          <div className={`${styles.conversionNote} fsText fsText--bodyMedium fsText--light`}>
            <p>No credit card required.</p>
            <p>Cancel anytime.</p>
          </div>
        </div>
        <div className={`${styles.hr} ${styles.inner}`} />
      </section>
      </div>

      <footer className={styles.footer}>
        <div className={`${styles.footerTop} ${styles.inner}`}>
          <div className={styles.footerBrand}>
            <div>
              <img src={assets.footerLogo} alt="Squarespace" />
              <p className={styles.footerTagline}>A website makes it real</p>
            </div>
            <div className={styles.footerIcann}>
              <div className={styles.footerIcannBadge} aria-hidden />
              <span>We are an ICANN accredited registrar.</span>
            </div>
          </div>
          {footerLinks.map((col) => (
            <div key={col.title} className={styles.footerCol}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={styles.footerCol}>
            <h3>Follow</h3>
            <ul>
              {["Facebook", "Instagram", "Linkedin", "Youtube", "X"].map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`${styles.footerBottom} ${styles.inner}`}>
          <div className={styles.footerLocales}>
            <button type="button" className={styles.footerLocaleBtn}>
              <span className={styles.iconSlot16} aria-hidden>
                <img src={assets.footerGlobe} alt="" />
              </span>
              English
              <span className={styles.iconSlot16} aria-hidden>
                <img src={assets.footerChevronDown} alt="" />
              </span>
            </button>
            <button type="button" className={styles.footerLocaleBtn}>
              $ USD
              <span className={styles.iconSlot16} aria-hidden>
                <img src={assets.footerChevronUp} alt="" />
              </span>
            </button>
          </div>
          <div className={styles.footerLegal}>
            {["Terms", "Privacy", "Your privacy choices", "Specific privacy notices", "Security measures", "Sitemap"].map(
              (t) => (
                <a key={t} href="#">
                  {t}
                </a>
              ),
            )}
            <span>© 2024 Squarespace, Inc.</span>
          </div>
        </div>
      </footer>

      {showToolbar ? (
        <PrototypeToolbar
          activePromo={toolbarProto.activePromo}
          onActivePromoChange={(v) => setToolbarProto((s) => ({ ...s, activePromo: v }))}
          ctaVariant={toolbarProto.ctaVariant}
          onCtaVariantChange={(v) => setToolbarProto((s) => ({ ...s, ctaVariant: v }))}
          promoVariant={toolbarProto.promoVariant}
          onPromoVariantChange={(v) => setToolbarProto((s) => ({ ...s, promoVariant: v }))}
        />
      ) : null}
    </div>
  );
}
