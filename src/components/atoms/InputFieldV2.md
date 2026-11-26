# InputField V2 — updated date input

Design reference: https://www.figma.com/design/YmluYFMIdELMbsDJqbPZBr?node-id=7-63

`InputFieldV2` is an opt-in version of the existing `InputField`, not a separate design system. It uses this repository's React/JavaScript components, CSS tokens, Source Sans 3 font and calendar. No dependencies or Storybook setup are added. The original `InputField` and its existing Figma binding remain unchanged.

## Scope

- `TripDatesCard` uses V2 for the required documents-back date and optional travel date.
- Empty date fields show `DD/MM/YYYY`, matching the selected updated design.
- Controls remain 42px tall: 24px content, 8px padding above and below, and a 1px border. Focus uses an inset second stroke so it does not change the size.
- Calendar strokes are 1.5px and use the existing secondary icon color. Label typography, required asterisk, 8px label gap, white fill, divider border and 4px radius reuse the existing tokens.
- Error, success and disabled states keep the existing accessible messages and behavior.
- Width follows its parent. The selected 330.6953125px field width is not forced onto the responsive checkout.

## Compatibility

The wrapper retains the original props and event contract. Date values remain `DD/MM/YYYY` in the order object, as required by this prototype; this is deliberately different from the ISO values in the other repository. Typed-date validation, calendar selection, past-date restrictions, processing-speed filtering and review summaries are unchanged. Other input consumers still use V1.

```jsx
import { InputFieldV2 } from './InputFieldV2.jsx'

<InputFieldV2
  label="Date you need the documents back"
  required
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

The Figma reference is a frame rather than a published main component, so no new Code Connect binding is fabricated.
