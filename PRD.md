# TVP Checkout Flow: Product Requirements

General context for building a working prototype. It covers what the product does and how it behaves. Visual design is in `design.md`; working rules for the coding agent are in `AGENTS.md`.
**[placeholder]** = sample data or copy, not final. **[assumption]** = decided in design without client confirmation. Fields marked * are required.

- **Client:** Travel Visa Pro (TVP), a service that helps customers with passports and visas. Redesign of its service ordering/checkout; client kick-off 2026-10-29.
- **Design source:** Figma file "TVP" (https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP).

## TL;DR
- Desktop checkout wizard with **5 steps**: Travelers, Service, VIP Service, Delivery, Payment.
- Customers order passport and visa services for **one or more travellers**, optionally add a **VIP package**, enter delivery details, and pay by card, PayPal, PayPal Credit, or Google Pay.
- A persistent **order summary** shows travellers, services, add-ons, promo, and the running total.
- Forms validate inline, per field. Every step has a designed filled (valid) state and an error state.
- Not designed yet: mobile/tablet, order confirmation, loading and server-error states.

## 1. Overview
- **Goal:** one clear checkout: traveller details, services and processing speed, optional VIP package, delivery, payment.
- **Users:** individual customers (for themselves or several travellers) and corporate customers with a TVP corporate account.
- **Scope:** the 5-step checkout and its order summary. Out of scope: marketing site, account area, order tracking, confirmation page.
- **Done for the prototype:** every designed screen and state works with real form logic (validation, Next enabled or disabled, accordion, promo, package selection, summary totals) on mocked data.

## 2. The flow

| # | Step | Page title | Purpose |
|---|---|---|---|
| 1 | Travelers | Kick off your order | Corporate account question, traveller details |
| 2 | Service | Trip and service details | Trip dates, services, options, processing speed per traveller |
| 3 | VIP Service | Choose service package | Optional VIP package, or continue with free services |
| 4 | Delivery | Delivery details | Shipping methods and delivery address |
| 5 | Payment | **[placeholder]** design still says "Delivery details" | Choose payment method and pay |

- Use the 5-step stepper. Early Step 1 and 2 designs show an older 6-step version with a separate "Speed" step; speed is now a field in Step 2.
- Every step has Previous step and Next step. Step 1 has no Previous. On Step 5 the primary action is the payment action. A "Go back" link is at the top of every step.

## 3. Requirements by step

### 3.1 Step 1: Travelers
**Corporate account:** "Do you have a corporate account?" with No (default) and Yes, plus a learn-more link about Business Accounts or Membership.
- Yes shows an **Account number*** field and a **Validate** button (enabled only when the field has a value).
- Valid: success state, "Account number verified", button reads "Validated". Invalid: "Account number not found. Check the number and try again." **[placeholder]**. Empty on continue: "Enter your account number to continue".
- Next needs a validated number when Yes is chosen.

**Traveller's details** (an "Add traveller" action adds a traveller; what follows is not designed): First name*, Last name*, Nationality* (select), State of residence* (select), Email address*, Phone number*, SMS consent (optional checkbox: "I consent to receive SMS updates about my order status"), Passport Services* (select), Visa Services by Country* (select).

### 3.2 Step 2: Service
- **Trip dates:** "Date you need the passport back"* and "Travel date" (optional). Format DD/MM/YYYY. Date picker: single date **[assumption]**, weeks start Monday, past dates disabled **[assumption]**.
- **Services per traveller** depend on Step 1. Designed example: passport sections (lost or stolen passport, name change, damaged passport; "Passport renewal" in the multi-traveller case), each with **Number of pages***, **Processing speed***, and an optional **Passport Card** add-on (+$30); plus a visa section (Uganda) with **Visa Type***, **Number of entries***, **Validity period***.
- **One traveller:** all sections in one card.
- **Several travellers:** one expandable card per traveller ("Traveller N | Name"). Only one is open at a time; the open one can be collapsed, so all can be collapsed. A status label shows next to the name, open or collapsed: red "N errors" (N = invalid fields), green "Complete" when all required fields are valid, nothing while untouched.
- The order summary updates with services, add-ons, and totals.

### 3.3 Step 3: VIP Service
Choose exactly one option. Default is **Free**, so Next is enabled at once.

| Option | Price (per traveler) **[placeholder]** | Includes |
|---|---|---|
| Free | $0 | Always: Document pre-check, Form-fill, Passport photo service, Resubmissions |
| VIP Lite | $99 | Free services plus VIP offices and authorized locations, acceptance agent appointment (DS-11) |
| VIP Concierge ("Most popular") | $770 | Lite plus adult US passport renewal (DS-82), consular appointment booking, dedicated VIP team, shipping protection inbound and return (up to $500), free 2nd day shipping both ways |
| Executive Club ("Premium") | $499 | Concierge plus on-demand mobile service, free overnight shipping both ways, dedicated personal assistant, 1-on-1 video support, letter and invitation help, FedEx signature, protection up to $3000, trip registration, passport replacement coverage |

- Prices are per traveler. A package adds a summary line (price x travellers) and updates the total; Free removes it.
- Each option shows a short feature list with "N more". Legacy lists have 6 (Lite), 13 (Concierge), 23 (Executive Club) items.

### 3.4 Step 4: Delivery
- **Shipping methods:** Inbound Shipping*, Return Shipping* (selects, carrier options such as FedEx 2nd Day or Overnight **[placeholder]**).
- **Delivery address:** Full name*, Phone number*, Company (optional), Street address*, an "Add an additional line for address" link that reveals a second line, City*, State* (select), Country (fixed "United States", not editable), Zip code*.

### 3.5 Step 5: Payment
Methods: **Card** (default), **PayPal**, **PayPal Credit**, **Google Pay**.
- **Card:** Card number*, Expiration date* (MM/YY), CVV*. Legal line about the PayPal Privacy Statement. Primary button "Place order", disabled until valid.
- **PayPal, PayPal Credit, Google Pay:** no fields. A short explanation of the redirect or confirmation and an enabled, method-specific primary button, for example "Continue with PayPal". All copy is **[placeholder]**.

## 4. Order summary and promo
- Always visible next to the form. Hierarchical: travellers contain services, services can contain cost lines; rows with children expand and collapse. Shows the running total.
- **Promo:** "I have a promo" opens an input with Apply and Cancel. A valid code adds a row like "Promo SUMMER10 (10% off)" with a green discount, a Remove action, and a lower total. Invalid: "This promo code is not valid or has expired" **[placeholder]**.
- Amounts in the designs are **[placeholder]** and do not always add up. Shipping costs are not in the summary yet.
- Under the summary: "Safe & Secure Payment" and "14 Day Money Back Guarantee".

## 5. Cross-cutting behavior
1. **Validation:** inline, per field, message under the field; required fields marked; errors appear on a continue attempt and clear when the value becomes valid.
2. **Next step:** disabled until the step is valid, but a click on an incomplete form must reveal the errors (use `aria-disabled`, not a real `disabled`).
3. **Optional fields** (Travel date, Company, SMS consent) never block Next.
4. **State:** one order object (travellers, trip, services, VIP package, delivery, payment method, promo); the summary and totals are derived from it.
5. **Accessibility:** native inputs with labels, errors linked with `aria-describedby`, visible focus, package choice as a radio group, accordion as expandable regions.
6. **Mock data:** corporate account `123456789` is the only valid number; promo `SUMMER10` (10% off) is the only valid code; JSON for services, packages, shipping, states, countries.

## 6. Not designed yet
Mobile and tablet; order confirmation page; loading, server-error, and empty states; error and filled states for the card form; what "Add traveller" does after the click.

## 7. Open questions and inconsistencies
1. Executive Club ($499) is cheaper than VIP Concierge ($770) although it is the premium tier. Real prices and order?
2. Can customers untick the free services, or are they always included? Show "$0 per order" anywhere?
3. VIP Lite adds only two items beyond the free services. Does it need more to justify $99?
4. Should shipping costs and the VIP package be separate summary lines, and when do real prices appear?
5. Error screens mark the optional Travel date and Company as invalid for completeness. Realistic?
6. Date picker: single date confirmed? Limits beyond "no past dates"?

Design inconsistencies: old 6-step stepper on Step 1 and 2 screens; Payment screens still titled "Delivery details" and "Delivery address"; typos "State of residense" and "No I'don't"; placeholder values throughout.

## 8. References
- Figma file "TVP": https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP (screens on `Designs`, components on `Components`).
- `design.md`: tokens, components, layouts, states, Figma screen index. `AGENTS.md`: rules for the coding agent.
