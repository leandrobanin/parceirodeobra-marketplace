---
name: Obra Certa
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#534434'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#867461'
  outline-variant: '#d8c3ad'
  surface-tint: '#855300'
  primary: '#855300'
  on-primary: '#ffffff'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#ffb95f'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#30c88f'
  on-tertiary-container: '#004e34'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is built on the pillars of reliability, precision, and high-end service. It targets a dual audience: homeowners seeking premium property maintenance and professional contractors who require a sophisticated workspace to manage their business. 

The visual style is **Corporate / Modern** with a strong influence from **Minimalism**. It avoids traditional construction tropes (like heavy textures or rugged patterns) in favor of a clean, SaaS-inspired interface. This approach elevates the perception of manual labor to professional "property services," instilling a sense of calm and organized efficiency through generous whitespace and a strictly governed layout.

## Colors
The palette is rooted in industry-standard signals but refined for a premium digital experience. 

- **Primary (Amber/Gold):** We use a sophisticated high-contrast amber (`#F59E0B`) rather than a standard safety yellow. This provides better legibility and a more premium feel. It is used exclusively for primary actions and key highlights.
- **Secondary (Charcoal):** A deep, near-black (`#111827`) provides the grounding force for the brand, used for typography and structural elements.
- **Surface & Background:** We utilize a two-tier background strategy. The base page background is a subtle cool gray (`#F9FAFB`), while active cards and containers use pure white (`#FFFFFF`) to create a clear visual hierarchy.
- **Semantic:** Success states use a professional emerald green (`#10B981`), while borders are kept extremely light (`#E5E7EB`) to maintain a clean, airy feel without visual clutter.

## Typography
The typography utilizes **Plus Jakarta Sans** for its modern, geometric construction and excellent legibility in both display and UI contexts. The font's slightly rounded terminals bridge the gap between "construction" (industrial) and "service" (friendly).

We employ a tight tracking (letter spacing) for large headlines to maintain a compact, high-end editorial feel. Body text is set with generous line-heights to ensure clarity when reading detailed service descriptions or contracts. All labels and metadata use a slightly higher font weight (Medium/SemiBold) to ensure they stand out against the background even at smaller sizes.

## Layout & Spacing
This design system operates on a strict **8px linear grid**. All dimensions, padding, and margins must be multiples of 8.

- **Desktop:** A 12-column fluid grid with a maximum container width of 1280px. Gutters are set to 24px.
- **Mobile:** A single-column layout with 16px side margins. 
- **Spacing Logic:** Use `md` (16px) for internal card padding and `lg` (24px) for vertical rhythm between sections. Use `xxl` (48px) to separate major content blocks to emphasize the "High-End" whitespace philosophy.

## Elevation & Depth
To maintain a modern SaaS feel, we avoid heavy, dark shadows. Instead, we use **Ambient Shadows** and **Tonal Layers**.

- **Level 0 (Background):** `#F9FAFB` - Used for the main canvas.
- **Level 1 (Card/Surface):** White surface with a 1px solid border in `#E5E7EB`. No shadow. This is the default state for content containers.
- **Level 2 (Hover/Active):** White surface with a soft, diffused shadow: `0px 10px 15px -3px rgba(17, 24, 39, 0.05)`. 
- **Navigation/Modals:** High elevation with a slightly more pronounced shadow to indicate temporary overlay.

Depth is primarily communicated through the transition from the gray background to white surfaces, creating a "stacked paper" effect.

## Shapes
We use a **Rounded** shape language to soften the industrial nature of the industry. 

- **Standard Elements:** Buttons, input fields, and small UI components use a `0.5rem` (8px) radius.
- **Containers:** Professional cards and service category containers use `rounded-lg` (1rem / 16px) to create a distinct, modern container feel.
- **Icons:** Icons should be enclosed in "squircle" or rounded-square containers with consistent corner radii to match the UI elements.

## Components

### Professional Cards
The core of the marketplace. Cards should have a 16px corner radius, a white background, and a subtle 1px border. The professional's profile image should be a 64px avatar with a 12px radius. Ratings should use the primary amber color for stars.

### Service Category Icons
Icons should be minimal, thick-stroke line icons (2px stroke). They are housed in a 56px circular or `rounded-xl` container with a light tint of the primary color (5% opacity) or a light gray background.

### Buttons
- **Primary:** Solid Primary Amber with Dark Charcoal text. This ensures maximum visibility for CTAs. 
- **Secondary:** White background with a 1px Charcoal border and Charcoal text.
- **Shadows:** No shadows on buttons; use a slight darken-on-hover effect for interaction feedback.

### Input Fields
Inputs use a white background, 8px corner radius, and 16px horizontal padding. The border color should shift from light gray (`#E5E7EB`) to the Primary Amber on focus to provide a clear, high-contrast focus state.

### Chips/Badges
Small status indicators (e.g., "Verified," "Available Now") use a `pill` shape. "Verified" badges should use the Primary Amber to denote premium status, while status chips use a subtle background-tinted version of the semantic colors (e.g., light green background with dark green text for "Success").