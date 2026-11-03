# TVP Checkout: Design Specification

Visual design only: layout, tokens, components, states, screens. Behavior and requirements are in `prd.md`.
Figma file: https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP (key `4cN2sjeRxYOB0Tfjh6gRKr`); pages `Designs` (screens), `Components` (library). Desktop only, 1440 wide. Font: Source Sans Pro (400, 600, 700; listed as "Source Sans 3" on Google Fonts).
Use the exact component names below in code. Never hardcode colors, sizes, or spacing: use the tokens. If this file and Figma disagree, Figma wins. **[placeholder]** = sample copy or data.

## 1. Page anatomy (same on every step)
- **Top bar:** 48 high, `brand/primary`. TVP logo (119x36) at x=156. Centered white text "Talk to real experts 24/7 @ 1-833-TVP-VISA (887-8472)", "real" and "24/7 @" bold.
- **Step bar:** 88 high, transparent. "Go back" link (arrow + text, brand blue) at x=40. Step indicator 1128 wide from x=156: 1px blue line through the marker centers, equal-width steps, 24px marker above the label. Completed = blue circle with check; Current = blue circle with number, bold label; Upcoming = white circle, gray border, number.
- **Hero:** `surface/page` background. Trust badge pill (366x48) "Trusted by over 1 million customers for 20 years", then the page title (`display`), centered.
- **Grid:** side margins 156. Main column **696**, gutter **24**, sidebar **408** (total 1128). Main column: cards stacked with 16 gaps, then 40 below, the Previous/Next bar.
- **Sidebar:** Order summary card, then two assurance lines (inset 32, 8 apart): "Safe & Secure Payment", "14 Day Money Back Guarantee". Page below the hero is white; the hero gray runs behind the top of the content.

## 2. Tokens
Suggested CSS variables: style name with `/` replaced by `-`, for example `--color-brand-primary`.

### 2.1 Color
| Token | Value | Use |
|---|---|---|
| `brand/primary`, `brand/pressed` | `#0059AC`, `#003F7D` | Top bar, current step, links, focus ring, checked checkbox, feature check icons |
| `accent/primary`, `accent/hover`, `accent/pressed` | `#F48120`, `#DC6910`, `#C45A00` | Primary button, selected option border and text, "Most popular" banner, "Add traveller" link |
| `accent/subtle` | `#F48120` at 10% | Fill of a selected option or pricing card |
| `text/primary`, `text/secondary` | `#222222`, `#222222` at 75% | Body text; labels and descriptions |
| `text/on-dark`, `text/link` | `#FFFFFF`, `#0059AC` | Text on blue or orange; links |
| `text/danger`, `text/success` | `#CD3739`, `#1E7B3A` | Errors and asterisks; discounts, success, "(free)" |
| `text/disabled`, `icon/disabled` | `#222222` at 40% | Disabled text and icons |
| `surface/page`, `surface/card` | `#F4F6F7`, `#FFFFFF` | Hero, hover fills, unselected pricing cards, disabled fields; cards and inputs |
| `surface/badge` | `#FDBD22` at 10% | Trust badge icon circle |
| `surface/danger-subtle`, `surface/success-subtle` | `#CD3739`, `#1E7B3A` at 10% | Error and success badge fills |
| `border/default` | `#8A8A8A` | Control borders (3.45:1 on white) |
| `border/strong` | `#222222` at 75% | Hover and filled borders, inactive step circle |
| `border/divider` | `#DBDBDB` | Dividers, disabled borders |
| `border/danger`, `border/success` | `#CD3739`, `#1E7B3A` | Error and valid input borders |
| `icon/primary`, `icon/secondary`, `icon/on-dark` | `#222222`, `#222222` at 75%, `#FFFFFF` | Icons |

### 2.2 Typography (Source Sans Pro)
| Style | Weight, size/line | Letter spacing | Use |
|---|---|---|---|
| `display` | Regular 40/48 | -2% | Page title |
| `amount` | Regular 32/32 | -2% | Totals, package price |
| `heading/large` | SemiBold 24/32 | -2% | Accordion title, Free row name |
| `heading` | SemiBold 20/24 | -2% | Card and section titles, plan names |
| `body/regular`, `body/strong` | Regular, SemiBold 16/24 | -2% | Body, input values; emphasis, summary rows |
| `body/link`, `button/underline` | SemiBold, underlined 16/24, 16/16 | -2% | Inline links; link hover |
| `button`, `label/regular` | SemiBold, Regular 16/16 | -2% | Buttons; inactive steps |
| `label/caps` | SemiBold 14/16, UPPERCASE | +1% | Field labels |
| `label/small` | SemiBold 14/16 | +1% | Badges, step numbers, weekday headers |
| `caption` | Regular 14/20 | +1% | Helper and error text, feature items |

### 2.3 Spacing, shape, elevation
- Spacing (px): 4, 8, 12, 16, 24, 32, 40. Card padding 32. Field gap 16. Section gap 24. Label to input 8. Section header to content 16.
- Radius 4 (cards, inputs, buttons); 999 (badges, pills, step circles). Controls 40 high; link buttons 24. Strokes 1px.
- `shadow/lg` = 0/16/32 black 8% (cards). `shadow/sm` = 0/4/8 black 5% (trust badge).
- Focus: 2px `brand/primary` ring outside the control (checkbox: around a 24x24 area).
- Icons: lucide-style 16px, 2px stroke, round caps: arrow-left, arrow-right, plus, chevron-up and down, info, check, tag, x, calendar, circle-alert, credit-card. Custom: verified-shield, money-back (20px), award. Logos: TVP, PayPal, PayPal Credit, Google Pay (96x24).

## 3. Shared patterns
- **Field states** (Text, Select, Date): Default `border/default`; Hover `border/strong`; Focus 2px blue ring; Filled `border/strong` and primary text; Error `border/danger` with red message below; Success `border/success` with check icon and green message; Disabled `border/divider`, `surface/page` fill, 40% text.
- **Field anatomy:** label above in `label/caps`, red asterisk if required, optional info icon at the far right of the label row. Select has a chevron, Date a calendar icon. Widths: 308 in two-column rows, 200 in three-column rows, 632 full. Messages are sentence case, `caption`, 8 under the box.
- **Single choice:** unselected = `border/default`; selected = 1px `accent/primary` border, `accent/subtle` fill where there is room, plus a check and the word "Selected".
- **Status badge:** pill with icon and label. Error: red on `surface/danger-subtle` ("5 errors"). Success: green on `surface/success-subtle` ("Complete").

## 4. Components (Figma `Components` page)
| Component | Variants | Props and notes |
|---|---|---|
| **Button** | Type: Primary, Secondary, Link, Link accent. State: Default, Hover, Pressed, Focus, Disabled | Label, optional leading and trailing icons. Primary and Secondary 40 high, padding 12/16, gap 8. Primary `accent/primary` with white text (hover and pressed darker, disabled `border/divider` fill). Secondary white with `border/default`. Link types 24 high |
| **Text link** | State: Default, Hover, Pressed, Focus, Disabled | Label. `body/link`, `text/link`, darker on hover and pressed |
| **Input field** | Type: Text, Select, Date. State: Default, Hover, Focus, Filled, Error, Disabled, Success | Label, Required, Info icon, Value, Helper text and Show helper text, Error message, Success message |
| **Checkbox** | Checked: False, True. State: Default, Hover, Focus, Disabled, Error. Description: False, True | Label, Show label, Error message, Description text, Show title, Title, Title required, Title info icon. 16px box in a 24px focus area; checked fill `brand/primary`; description sits 16 below the row |
| **Button group item** | Selected: False, True. State: Default, Hover, Pressed, Focus, Disabled. Content: Text, Logo | Label and icons, or a swappable Logo (96px logo, 16 side padding). 40 high. Selected: orange border and text, hover fill `accent/subtle` |
| **Button group** | none | Slot `Options`; items share the width, 16 gap |
| **Badge** | Type: Error, Success | Label, Show icon |
| **Step marker**, **Step** | State: Current, Upcoming, Completed | Number (marker), Label (step) |
| **Chevron toggle** | State: Open, Closed | 16px chevron |
| **Divider** | none | 1px `border/divider` |
| **Calendar day**, **Calendar** | Day state: Default, Hover, Today, Selected, Disabled, Outside | Day cell 40x40, radius 4; Today has a blue outline and bold text; Selected is blue with white text. Calendar is 308 wide with `shadow/lg`, padding 16, prev and next arrows, a month title (prop Month), a Mon to Sun row, six week rows |
| **Trust badge**, **Assurance item** | none | White pill with `shadow/sm`, 32px icon circle, text; assurance is a 20px icon plus `body/strong` text. Label and Icon props |
| **Summary row** | Level: 1, 2, 3 (indent 0, 12, 24). Chevron: None, Closed, Open | Label, Price, Show price, Show chevron. A 16px chevron slot is always reserved so labels line up. Levels 1 and 2 SemiBold, level 3 Regular; price right-aligned |
| **Summary group** | Level: 1, 2. State: Open, Closed | Parent row plus slot `Children` shown when open |
| **Total row** | none | "Order total:" and Amount (`amount` style) |
| **Order summary** | View: Summary, Promo form, Promo applied, Promo error | 408 wide, padding 32, `shadow/lg`; title, slot `Rows`, divider, Total row, divider, promo area. Promo form: input, Apply (Primary), Cancel (Link). Promo applied: tag icon, name, green discount, Remove link |
| **Summary sidebar** | none | Order summary plus the two assurance lines |
| **Card** | none | White, radius 4, padding 32, `shadow/lg`; slot `Content`, 24 gap. Every form card |
| **Form section** | none | Show divider (24 around it), Show header; slot `Content`, 16 gap. Sections after the first in a card get the divider |
| **Section header**, **Form row** | none | Title (`heading`) with optional action link (Link accent, plus icon); Form row has slot `Fields`, items share the width, 16 gap |
| **Accordion header** | State: Open, Closed | Title (24px SemiBold), 20px chevron, optional status Badge at the right |
| **Corporate account** | State: No, Yes, Yes filled, Yes error, Yes valid, Yes invalid | Question, Button group, optional Account number field and Validate button |
| **Pricing card** | Orientation: Vertical (200 wide), Horizontal (632 wide). State: Inactive, Active | Name, Tagline, Price, Price note, Lead, Show price, Show lead, Show banner, Banner label; slot `Features`; exposed Select button |
| **Header**, **Step indicator**, **Step navigation** | Navigation: Step First or Other, Next Enabled or Disabled | Header: top bar, back link, indicator. Navigation 696 wide: "Previous step" (Secondary) left, "Next step" (Primary, arrow) right; First hides Previous |

**Pricing card detail.** Vertical: 24 banner row on top (empty spacer, or an orange strip with the label), body padding 16/12 with radius 0/0/4/4. Order: name (`heading`, centered, secondary), price and "per traveler" on one line, full-width Select button, tagline (`body/strong`), lead (`caption`), features slot (4 apart), "N more" link. Inactive: `surface/page` fill, no border. Active: `accent/subtle`, 1px orange border, button "Selected" with check. Horizontal (Free row): 168 intro column (name in `heading/large`, tagline, optional price, hug-width Select button 32 high) and features in two columns. Feature item: 16px tile with 12px check icon (`brand/primary`) and a `caption` label.

## 5. Screens and states
Each step has a default screen plus filled (valid) and error screens, all on the page anatomy above.
- **Step 1:** corporate-account card (Button group, learn-more link; Yes adds the Account number field and Validate button) and "Traveller's details" card (rows First/Last, Nationality/State, Email/Phone with info icons, SMS checkbox, two full-width selects). Screens: No account, Yes empty, Yes error, Yes filled, All filled, All errors.
- **Step 2:** Trip dates card with Date fields (Calendar opens 4 under the focused field). Single traveller: one card, sections separated by dividers; each passport section has Number of pages and Processing speed in a row, then a full-width checkbox with title "Additional Options" and a description. Multiple travellers: one Card per traveller with an Accordion header first; closed cards show only the header (96 high); badge shows "N errors" or "Complete". Screens: single Default, Filled, Errors, Date picker open; multiple Default, Filled, Errors, each with Traveller 1 open, Traveller 2 open, All collapsed.
- **Step 3:** one Card titled "Choose a package, or continue with the free services." with three vertical Pricing cards (VIP Lite, VIP Concierge with "Most popular" banner, Executive Club; 16 gap, equal height) and the horizontal Free card. Screens: Default (Free Active), Concierge selected (adds a "VIP Concierge x 2 travelers" summary row).
- **Step 4:** "Shipping methods" card (two selects in a row); "Delivery address" card (name and phone, company and street full width, "Add an additional line for address" link, city and state, disabled country and zip). Screens: Default, Filled, Errors.
- **Step 5:** one Card with a Button group (Card text option selected by default; PayPal, PayPal Credit, Google Pay logo options) and a second section with a divider. By Card: Card number (credit-card icon), Expiration date and CVV, legal line, "Place order" disabled until valid. Other methods: logo, one-line explanation, legal line, enabled method-specific button **[placeholder]**.

## 6. Figma screen index (`Designs` page)
Node IDs use `114:229` in the API and `node-id=114-229` in URLs.
- **Step 1:** No account `114:229`, Yes empty `120:1921`, Yes error `120:2271`, Yes filled `120:2602`, All filled `127:2217`, All errors `127:2266`
- **Step 2 single:** Default `128:5660`, Filled `155:3292`, Errors `155:4352`, Date picker open `158:5739`
- **Step 2 multiple** (T1/T2 = traveller open): Default T1 `142:6702`, T2 `155:5311`, collapsed `155:6015`; Filled T1 `155:6488`, T2 `155:7190`, collapsed `155:7892`; Errors T1 `155:8388`, T2 `155:9070`, collapsed `155:9752`
- **Step 3:** Default `142:14872`, Concierge selected `165:6807`
- **Step 4:** Default `177:17252`, Filled `184:6226`, Errors `184:6667`
- **Step 5:** by Card `188:18249`, PayPal `193:6904`, PayPal Credit `193:8086`, Google Pay `193:8420`

## 7. Accessibility and known gaps
- White text on `accent/primary` is about 2.6:1 and fails WCAG AA (primary button, "Add traveller", selected border). Orange stays the brand accent by decision; consider a darker orange for text and controls. `accent/pressed` with white is about 4.6:1.
- `border/default` meets 3:1 for control boundaries; `border/divider` is for dividers and disabled controls only. Selection never relies on color alone.
- Link buttons are 24 high to meet the minimum target size.
- Gaps: Step 1 and 2 screens show an old 6-step stepper (use 5 steps); Payment screens are still titled "Delivery details" and "Delivery address"; typos "State of residense" and "No I'don't"; not designed: mobile and tablet, loading and error states, order confirmation, card error and filled states, the "Add traveller" flow.
