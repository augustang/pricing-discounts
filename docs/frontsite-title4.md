# Title 4 — responsive spec

Source: [Frontsite Library · Foundations — Title 4](https://www.figma.com/design/rOd6SqNXLdqSZ9T9mHD1R4/Frontsite-Library-%C2%B7-Foundations?node-id=4185-52) (node `4185:52`).

Implementation: [`src/styles/frontsite-typography.css`](../src/styles/frontsite-typography.css) (`.fsText--title4`).

## Interpolation

Between the viewport widths in the table below, **font size** uses **linear `clamp()`** segments so type scales smoothly while matching the **exact** sizes at each anchor. The Figma file defines those anchors.

**Ramps:** 320–374px (34→40), 1020–1279px (40→50), 1280–1439px (50→56), 1440–1919px (56→74). **Flat:** 375–1019px at 40px; below 320px fixed 34px; ≥1920px fixed 74px.

**`font-weight`** switches to **300** from **1280px** up (discrete). **`line-height`** is **1.08** until **1920px**, then **1.04**.

| Min width | Font size | Weight   | Family / style   | Line height | Letter spacing (Figma) |
| --------- | --------- | -------- | ---------------- | ----------- | ------------------------ |
| (default, &lt;320px) | 34px      | 400      | BookProduct      | 1.08        | -4                       |
| 320px→374px | 34px→40px (ramp) | 400 | BookProduct   | 1.08        | -4                       |
| 375px     | 40px      | 400      | BookProduct      | 1.08        | -4                       |
| 1020px    | 40px      | 400      | BookProduct      | 1.08        | -4                       |
| 1280px    | 50px      | 300      | Light            | 1.08        | -4                       |
| 1440px    | 56px      | 300      | Light            | 1.08        | -4                       |
| 1920px    | 74px      | 300      | Light            | 1.04        | -4                       |

In CSS, Figma letter spacing **-4** is applied as **`letter-spacing: -0.04em`** (approx. -4% of font size).

375px and 1020px share the same 40px size in the library; both breakpoints are listed for parity with the file.
