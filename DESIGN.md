# Design Brief: Medi Bot

## Overview
Professional medical chatbot UI combining editorial typography with medical color psychology. Refined minimalism with warm, approachable styling. Prominent safety disclaimers reinforce trustworthiness.

## Tone
Refined minimalism with medical-grade precision. Warm, approachable, professional authority without sterility.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Purpose |
|-------|------------|-----------|---------|
| Primary (Medical Blue) | 0.58 0.11 261 | 0.72 0.13 261 | CTAs, headers, primary actions |
| Secondary (Sage Green) | 0.72 0.18 142 | 0.52 0.15 142 | Secondary actions, success states |
| Accent (Warm Amber) | 0.68 0.15 80 | 0.68 0.15 80 | Warnings, alerts, emphasis |
| Neutral (Grey) | 0.88 0.02 0 (light) | 0.32 0.01 0 (dark) | Muted text, disabled states |
| Background | 0.98 0.01 0 (light) | 0.16 0.01 255 (dark) | Page backgrounds |
| Foreground | 0.18 0.01 0 (light) | 0.92 0.01 0 (dark) | Primary text |

## Typography

| Type | Font | Use |
|------|------|-----|
| Display | Fraunces (Serif) | Headers, titles, logo — conveys editorial authority |
| Body | GeneralSans (Humanist Sans) | Body text, chat bubbles, UI copy — clean, accessible |
| Mono | GeistMono | Data, credentials, timestamps, code snippets |

## Shape Language
- **Border Radius**: 10px (`rounded-lg`) for cards, buttons, input; 0 for strict edges where precision matters (badges, pills)
- **Shadows**: Medical shadows (subtle, professional — no glow), elevation hierarchy via shadow intensity
- **Spacing**: 4px grid, 24px base vertical rhythm

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | Solid primary blue bg, white text, Fraunces logo | Brand anchoring, mode toggle |
| Chat Area | `bg-background` with alternating message cards | Core interaction surface |
| Message Bubbles | `bg-card` with `shadow-medical`, 10px border radius | Clear user/bot separation |
| Disclaimer Banner | Semi-transparent `bg-accent/10` with `text-accent` border-l, compact | Safety & legal reinforcement |
| Input Bar | Sticky footer with `bg-card`, `border-t`, input field + send button | Always-accessible message entry |
| Mobile | Full-width cards, bottom-aligned input, scrollable history | Touch-friendly layout |

## Component Patterns
- **Buttons**: Primary (medical blue, white text), Secondary (sage green outline), Destructive (warm red)
- **Cards**: Always elevated with `shadow-medical`, never flat
- **Input**: Clean border-only style, focus ring in primary color, placeholder in `text-muted-foreground`
- **Disclaimer**: Left border accent in `accent` color, icon badge, compact sans-serif

## Motion & Transitions
- **Default transition**: `transition-smooth` (0.3s ease-out)
- **Entrance**: Fade-in + subtle 2px downward slide for chat messages
- **Hover states**: 2% lightness shift on interactive elements, no scale transforms

## Responsive
Mobile-first design. Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Chat bubbles expand to 90% width on mobile, 60% on desktop. Input bar always sticky on mobile, inline on desktop.

## Dark Mode
Deep charcoal backgrounds (`0.16` L) with bright text (`0.92` L). Primary blue lightens to `0.72` L for contrast. All colors tune L and C — no opacity shifts.

## Constraints
- No generic purple gradients
- No default Tailwind colors or shadows
- No bouncy animations or unnecessary motion
- All colors via OKLCH tokens, never hex or rgb()
- Typography pair fixed: Fraunces + GeneralSans (no system fonts)
- Disclaimer always visible and styled intentionally

## Signature Detail
Medical blue header with white Fraunces logo. Prominent, left-bordered disclaimer badge transforms safety requirement into visual anchor. Message bubbles inherit medical blue accent on user side, sage green on bot side.
