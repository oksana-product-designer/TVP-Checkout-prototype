# AGENTS.md

Instructions for the coding agent working on the TVP checkout prototype. Keep this file short. The details live in the docs listed below.

## Project
A desktop checkout wizard for Travel Visa Pro (TVP): customers order passport and visa services for one or more Applicants, optionally add a VIP package, enter delivery details, and pay. This repo is a working front-end prototype with mocked data, not a production backend.

Steps: 1 Trip and applicants, 2 Service, 3 VIP Service, 4 Delivery, 5 Payment. A persistent order summary sits next to the form.

## Read these first
- `docs/prd.md`: what to build, the flow, requirements per step, validation and behavior rules, open questions.
- `docs/design.md`: tokens, layouts, components and their variants, states, and the Figma screen index.

Read the relevant file before building or changing a screen. If this file and those docs disagree, the docs win. If the docs and the Figma file disagree, the Figma file wins; ask me when it matters.

Figma file: https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP (file key `4cN2sjeRxYOB0Tfjh6gRKr`). Node IDs for every screen are in `docs/design.md`. Use the Figma MCP if it is available.

## Stack and commands
Keep it as simple as possible. No extra libraries unless I ask.

- **Stack:** Vite + React, plain JavaScript (no TypeScript), plain CSS. No Tailwind, no UI library, no form library.
- **Design tokens:** one file, `src/styles/tokens.css`, with CSS variables taken from `docs/design.md` (section 2). It is imported once in `src/main.jsx`. Components use only `var(--...)` values from it.
- **State:** React `useState` plus one Context for the order object. **Validation:** small plain functions in `src/state/validation.js`.
- **Requires:** Node.js (current LTS version) installed.
- **Create the project (once):** `npm create vite@latest tvp-prototype -- --template react`, then `cd tvp-prototype`
- **Install:** `npm install`
- **Dev server:** `npm run dev` (opens at http://localhost:5173)
- **Build:** `npm run build`
- **Test:** `npm test` (Vitest and React Testing Library).
- **Lint:** `npm run lint`

Before saying a task is done, run `npm run lint` and `npm run build` and fix any errors.

## Suggested structure (adjust to the actual repo)
```
docs/            prd.md, design.md
src/
  styles/        tokens.css (design tokens), global.css (font, reset)
  components/    atoms, molecules, organisms (same names as in Figma)
  steps/         one folder per step (travelers, service, vip, delivery, payment)
  state/         order context, validation functions, totals
  mocks/         JSON data: services, packages, shipping methods, states, promo codes
```

## Rules
1. **Use the tokens.** Never hardcode colors, font sizes, spacing, radii, or shadows. Add a token only if it exists in `docs/design.md` or I approve it.
2. **Reuse components.** Use the components named in `docs/design.md` (Button, Input field, Checkbox, Button group, Card, Form section, Pricing card, and so on) with the same names and variants. Do not create a one-off look for something that already has a component. If a needed component does not exist, ask me before inventing one.
3. **Match the design.** Layout, states, and copy follow `docs/design.md` and the Figma screens. Do not redesign. Flag inconsistencies instead of silently fixing them (known ones are listed in both docs).
4. **Cover every state.** Every form field and button needs its states: default, hover, focus, filled, error, success where it applies, and disabled. Every step needs a way to reach its filled and error screens by interacting.
5. **Validation:** inline, per field, message under the field, errors clear as soon as the value becomes valid. Next is enabled only when the step is valid, but a click on an incomplete Next must reveal the errors (use `aria-disabled`, not the `disabled` attribute).
6. **Single source of truth:** keep one order object. Derive the order summary and totals from it. Do not store totals separately.
7. **Mock data only.** No real network calls or payment providers. Suggested mock rules: corporate account `123456789` is valid, promo `test0` gives 10% off.
8. **Accessibility:** native elements where possible, labels tied to inputs, errors linked with `aria-describedby`, visible focus, package choice as a radio group, the Applicant accordion as proper expandable regions, keyboard operable everywhere.
9. **Desktop only (1440px).** Do not build mobile layouts unless I ask.
10. **Scope:** build only what was asked. Do not add libraries, restructure folders, or change unrelated files without asking first.
11. **Placeholders:** copy, prices, dates, and amounts in the docs marked as placeholder are sample data. Keep them in the mock files so they are easy to replace.

## Working style
- Before a large change, say what you plan to do in a few lines and wait if it affects structure or adds a dependency.
- Make small, focused changes. Explain what changed and where.
- When something in the docs is unclear or missing, ask instead of guessing.

## Known gotchas
- Use the **5-step** stepper (Trip and applicants, Service, VIP Service, Delivery, Payment). Some early Step 1 and Step 2 screens still show an older 6-step version.
- The Payment screens still show "Delivery details" as the page title and "Delivery address" as the first section title. Use proper payment wording.
- Copy typos in the design ("State of residense", "No I'don't") should be corrected in code.
- Executive Club ($499) is cheaper than VIP Concierge ($770) in the current data. This is an open question; keep the values in the mock file.
- White text on the orange accent fails contrast. Keep the brand color, and flag it if a control needs a darker orange.
