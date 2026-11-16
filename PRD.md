# TVP Checkout Flow: Product Requirements

General context for building a working prototype. It covers what the product does and how it behaves. Visual design is in `design.md`; working rules for the coding agent are in `AGENTS.md`.
**[placeholder]** = sample data or copy, not final. **[assumption]** = decided in design without client confirmation. Fields marked * are required.

- **Client:** Travel Visa Pro (TVP), a service that helps customers with passports and visas. Redesign of its service ordering/checkout; client kick-off 2026-10-29.
- **Design source:** Figma file "TVP" (https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP).

## TL;DR
- Desktop checkout wizard with **6 steps**: Trip and applicants, Services, VIP Services, Delivery, Review, Payment.
- Customers order passport and visa services for **one or more Applicants**, optionally add a **VIP package**, enter delivery details, and pay by card, PayPal, PayPal Credit, or Google Pay.
- A persistent **order summary** shows Applicants, services, add-ons, promo, and the running total.
- Forms validate inline, per field. Every step has a designed filled (valid) state and an error state.
- Not designed yet: mobile/tablet, order confirmation, loading and server-error states.

## 1. Overview
- **Goal:** one clear checkout: Applicant details, services and processing speed, optional VIP package, delivery, payment.
- **Users:** individual customers (for themselves or several Applicants) and corporate customers with a TVP corporate account.
- **Scope:** the 6-step checkout and its order summary. Out of scope: marketing site, account area, order tracking, confirmation page.
- **Done for the prototype:** every designed screen and state works with real form logic (validation, Next enabled or disabled, accordion, promo, package selection, summary totals) on mocked data.

## 2. The flow

| # | Step | Page title | Purpose |
|---|---|---|---|
| 1 | Trip and applicants | Trip and applicants | Corporate account question, Applicant details, trip dates |
| 2 | Services | Services | Services, options, processing speed per Applicant |
| 3 | VIP Services | Service package | Optional VIP package, or continue with free services |
| 4 | Delivery | Delivery | Documents delivery and delivery address. Skipped when every service is an online visa |
| 5 | Review | Review your order | Read-only check of the order before payment. Always continues |
| 6 | Payment | Payment | Choose how to pay |

- Use the 6-step stepper. Early Step 1 and 2 designs show an older 6-step version with a separate "Speed" step; speed is now a field in Step 2. Those screens do not include Review.
- Every step has Back and Next step. Step 1 has no Back. On Review the primary action is "Continue to payment" and it is always enabled. On Payment the primary action is the payment action. A "Back" link is at the top of every step. In the step indicator, a step already reached and the current step can be opened. A step not yet reached cannot.

## 3. Requirements by step

### 3.1 Step 1: Trip and applicants
**Affiliate banner:** the first section on the step, above the corporate account question. A Card with the affiliate's logo and a short description. Display only: no input, nothing in the order. Logo, name and copy are **[placeholder]** and live in `src/mocks/affiliate.json`.

**Corporate account:** "Do you have a corporate account?" with "No, I don't" (default) and "Yes, I have". When No is selected, a checkbox reads "Email me about business accounts", with an info tooltip: "A business account is a company plan. It applies your company discount and can fill in your usual delivery address." **[placeholder]**. The checkbox is hidden when Yes is selected. Checking it does not change the price.
- Yes shows an **Account number*** field and a **Check account** button (enabled only when the field has a value).
- Valid: success state, "Account verified", and the button reads "Account verified". Invalid: "Account number not found. Check the number and try again." **[placeholder]**. Empty on continue: "Enter your account number to continue".
- Next needs a validated number when Yes is chosen.
- A validated account takes **20% off the whole order** (services, VIP package and shipping, before any promo code) as soon as it is validated. The summary shows a green "Corporate account (20% off)" row with the amount. The discount stops when the number is edited or the answer changes to No. The rate is **[placeholder]** and lives in `src/mocks/corporate-accounts.json`.

**Trip dates** is the second section, after the corporate account question: "Date you need the documents back"* and "Travel date" (optional). The field placeholder is "Day/month/year". The value is still stored as DD/MM/YYYY. Date picker: single date **[assumption]**, weeks start Monday, past dates disabled **[assumption]**.

**Applicant's details** (an "Add an applicant" action adds an Applicant): First name*, Last name*, Nationality* (select), State of residence* (select), Email address*, Phone number*, SMS consent (optional checkbox: "Text me order updates"). Passport and visa services are chosen on Step 2. Email error: "Enter an email address like name@example.com". Phone error: "Enter a 10-digit US phone number." The phone field still groups digits as `(000) 000 00 00`.

### 3.2 Step 2: Service
- **Service choice** is made here, per Applicant, with choice chips: Passport, Visa, Legalization, and Translation. An unselected chip is filled gray and shows a plus icon. A chosen chip is filled with the accent color and shows a check icon. Choosing it again removes it, with the same confirmation as Remove when details are entered. Nothing is chosen by default. Each chosen Passport or Visa must be filled in before Next. With none chosen, Next reveals "Select services to get started". Each chosen Passport or Visa section sits in a gray box. Each Passport or Visa box has a Remove link. If a passport service or a country is already chosen, Remove asks for confirmation before deleting those details. An empty service is removed immediately. The Passport section is titled Passport and shows **Select a passport service***. The chosen passport service has **Number of pages***, preselected to 28 Pages (Standard), **Processing speed***, and an optional **Passport Card** add-on (+$30). The Visa section is titled Visa and asks for a country, then the visa fields with no separate title: **Visa type*** and **Processing speed*** on the first row, and **Number of entries*** and **Validity period*** on the second. Once any field under a chosen passport service or visa country is filled, that dropdown is disabled so another service or country cannot be chosen. The preset 28 pages does not lock it by itself. Legalization and Translation can be chosen; their forms are not specified yet. Processing speed uses the same choices for both. The choices adjust to the "Date you need the documents back" from Step 1: a speed whose days exceed the days left until that date is not shown (the fastest is always shown). Badges: each option shows at most one. **Fastest** (shortest) and **Cheapest** (slowest) mark those speeds. **Recommended** marks the slowest speed that still meets the date, and replaces Fastest or Cheapest on that option. With no date, every speed is shown and nothing is recommended. Changing the date clears any chosen speed that no longer fits, so it must be picked again. Days per speed are **[placeholder]** in `src/mocks/processing-speeds.json`. Each option also shows a starting price, such as "from $20", from `fromPrice` in that file **[placeholder]**. The price is display only and does not change the order total.
- One passport service and one visa country can be chosen per Applicant.
- Next stays unavailable until every Applicant has each chosen service filled in.
- **One Applicant:** the card has no accordion.
- **Several Applicants:** one expandable card per Applicant ("Applicant N | Name"). Only one is open at a time; the open one can be collapsed, so all can be collapsed. A status label shows next to the name, open or collapsed: red "N errors" (N = invalid fields), green "Complete" when all required fields are valid, nothing while untouched.
- The order summary updates with services, add-ons, and totals.

### 3.3 Step 3: Service package
Select one of three packages, or none. Nothing is selected by default, and Next is enabled either way. Selecting a package adds it; selecting that same package again clears it. There is no separate Free option.

| Option | Price **[placeholder]** | Includes |
|---|---|---|
| VIP Lite | $0, with $99 crossed out | Document pre-check, Form preparation, Passport photo service, Free corrections, VIP offices and authorized locations, acceptance agent appointment (DS-11) |
| VIP Concierge ("Most popular") | $770 | Lite plus adult US passport renewal (DS-82), consular appointment booking, dedicated VIP team, shipping protection inbound and return (up to $500), free 2nd day shipping both ways |
| Executive Club ("Premium") | $499 | Concierge plus on-demand mobile service, free overnight shipping both ways, dedicated personal assistant, 1-on-1 video support, letter and invitation help, FedEx signature, protection up to $3000, trip registration, passport replacement coverage |

- VIP Concierge is priced per Applicant (card note "per applicant"; the summary row reads "VIP Concierge (N Applicants)" at price × N). Executive Club is once per order (info tooltip next to the price: "Available during 1 year after ordering"). A chosen package adds one summary line, including VIP Lite at $0.00. With none chosen, there is no VIP row. The selected package's button is the orange Primary button and reads "Selected".
- Each option shows a short feature list with "N more". Legacy lists have 6 (Lite), 13 (Concierge), 23 (Executive Club) items.
- The package card is titled "Select a package". **Additional services** sits under the packages: Document pre-check, Passport photo service, Form preparation, and Free corrections. All four are checked by default and do not appear in the order summary. Choosing a package disables the section and shows all four checked; clearing the package restores the customer's earlier choices. The list is **[placeholder]** in `src/mocks/additional-services.json`.

### 3.4 Step 4: Delivery
- **Documents delivery:** How will you send your documents?*, How should we return them?* Both labels are sentence case. How will you send your documents? offers Fedex 2nd Day Shipping ($24), FedEx Priority (morning) Overnight ($49), I will ship on my own, Personal Delivery To TVP VIP Office, and Personal Delivery To TVP Authorized Location. How should we return them? offers FedEx 2nd Day Shipping ($24), FedEx Priority (morning) Overnight ($49), FedEx Saturday Priority Overnight ($79), Personal Pickup From TVP VIP Office, Personal Pickup From TVP Authorized Location, and I will provide a pre-paid, pre-addressed return label. Prices without an amount in the label are $0 **[placeholder]**. The order summary still names those legs "Ship to us" and "Ship back to you".
- **Delivery address:** hidden until at least one leg is FedEx, shipping on your own, or an authorized location. Personal Delivery To TVP VIP Office and Personal Pickup From TVP VIP Office do not show it. It also stays hidden when "I will ship on my own" is paired with "Personal Pickup From TVP VIP Office" or "Personal Pickup From TVP Authorized Location". While it is hidden, the address is not validated and any entered values are kept. When it is shown, the fields are active: Full name*, Phone number*, Company (optional), Street address*, City*, State* (select), Country (fixed "United States", not editable), Zip code*. At the bottom of the section, an "Add a note to the order" link reveals an optional "Note to the order" field with a Remove action. The note is never validated and does not affect the order, summary or totals.
- **Prefill:** the first time the step opens, Full name, Phone number and State are filled from Applicant 1. When a corporate account is validated, its known details (contact name, phone, company, street, city, state, zip) fill the address once per validated account, replacing those values. All fields stay editable, and edits are never overwritten. Account details are **[placeholder]** in `src/mocks/corporate-accounts.json`.
- **Online visas skip delivery.** A visa type counts as online when its name contains "Online" (Business Online, Tourist Online). Delivery is skipped only when every chosen service on the order is an online visa. A passport, a regular visa, or a mix of those with an online visa still requires this step.
- When delivery is skipped, Next on VIP Services opens Review. Back on Review opens Delivery, which shows the skip message, and Back on Payment opens Review. The Delivery step stays in the stepper and is treated as complete. Opening it shows an empty state that names each online visa, for example "No shipping is needed for the Afghanistan tourist visa (online)." Several visas are joined with "and". Shipping is omitted from the total, and any shipping already entered is kept.
- If the user later changes an online visa to a regular visa or adds a passport, Delivery is required again. Next on VIP Services stops on Delivery. A shipping choice that is still valid is kept. The stepper cannot open Review or Payment until Delivery is valid.

### 3.5 Step 5: Review
Read-only. Title "Review your order", subtitle "Check your details before you pay." Four cards, filled from the order: Trip and applicants, Services, VIP package and services, and Delivery. Each card has an Edit link that opens that step. On Trip and applicants, a divider separates the trip rows from each applicant. On Services, a divider separates applicants. Missing values show "Not provided". An empty travel date shows "Not set". There is no terms checkbox and no error state. The primary action is "Continue to payment" and it is always enabled. When delivery was skipped, the Delivery card shows the same skip message as the Delivery step.

### 3.6 Step 6: Payment
Methods: **Card** (default), **PayPal**, **PayPal Credit**, **Google Pay**.
- **Card:** Card number*, Expiration date* (MM/YY), CVV*. Legal line: "By paying with my card, I agree to the Travel Visa Pro privacy policy." Primary button "Place order", disabled until valid. PayPal and PayPal Credit keep their own PayPal privacy line.
- **PayPal, PayPal Credit, Google Pay:** no fields. A short explanation of the redirect or confirmation and an enabled, method-specific primary button, for example "Continue with PayPal". All copy is **[placeholder]**.

## 4. Order summary and promo
- Always visible next to the form. Hierarchical: Applicants contain services, services can contain cost lines. Applicant rows are listed under the title and start collapsed; their chevron opens the services. The title is not a toggle. Shows the running total.
- **Promo:** moved to Step 6 (Payment), where it is the first section above the payment methods: a Card titled "Promo code" with a Promo code field and an Apply button. A valid code shows "Promo code applied", the button reads "Applied", and the summary gets a green row such as "Promo test0 (10% off)" with the discount, under the Corporate account row (or under the services list when there is none) and above the total. Editing the code removes the discount. Invalid: "This promo code is not valid or has expired" **[placeholder]**. The order summary itself no longer has a promo area.
- Amounts in the designs are **[placeholder]** and do not always add up. Shipping costs are not in the summary yet.
- Under the summary: "Safe and secure payment" and "14-day money-back guarantee".

## 5. Cross-cutting behavior
1. **Validation:** inline, per field, message under the field; required fields marked; errors appear on a continue attempt and clear when the value becomes valid. Every phone field uses spaces, `(000) 000 00 00`. A phone that is not 10 digits shows "Enter a 10-digit US phone number."
2. **Next step:** disabled until the step is valid, but a click on an incomplete form must reveal the errors (use `aria-disabled`, not a real `disabled`).
3. **Optional fields** (Travel date, Company, SMS consent) never block Next.
4. **State:** one order object (Applicants, trip, services, VIP package, delivery, payment method, promo); the summary and totals are derived from it.
5. **Accessibility:** native inputs with labels, errors linked with `aria-describedby`, visible focus, package choice as a radio group, accordion as expandable regions.
6. **Mock data:** corporate account `123456789` is the only valid number; promo `test0` (10% off) is the only valid code; JSON for services, packages, shipping, states, countries.

## 6. Not designed yet
Mobile and tablet; order confirmation page; loading, server-error, and empty states; error and filled states for the card form; what "Add an applicant" does after the click.

## 7. Open questions and inconsistencies
1. Executive Club ($499) is cheaper than VIP Concierge ($770) although it is the premium tier. Real prices and order?
2. Should shipping costs and the VIP package be separate summary lines, and when do real prices appear?
3. Error screens mark the optional Travel date and Company as invalid for completeness. Realistic?
4. Date picker: single date confirmed? Limits beyond "no past dates"?

Design inconsistencies: old 6-step stepper on Step 1 and 2 screens (a Speed step, and no Review); Payment screens still titled "Delivery details" and "Delivery address"; typos "State of residense" and "No I'don't"; placeholder values throughout. Review is not in Figma.

## 8. References
- Figma file "TVP": https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP (screens on `Designs`, components on `Components`).
- `design.md`: tokens, components, layouts, states, Figma screen index. `AGENTS.md`: rules for the coding agent.
