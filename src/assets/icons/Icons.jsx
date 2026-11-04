const icons = {
  'arrow-left': (
    <path
      d="M7.99667 3.32999L3.33 7.99665L7.99667 12.6633M3.33 7.99665H12.6633"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'arrow-right': (
    <path
      d="M3.33 7.99665H12.6633M7.99667 12.6633L12.6633 7.99665L7.99667 3.32999"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  plus: (
    <path
      d="M3.33 7.99665H12.6633M7.99667 3.32999V12.6633"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'chevron-down': (
    <path
      d="M4 6L8 10L12 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'chevron-up': (
    <path
      d="M12 10L8 6L4 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  info: (
    <path
      d="M7.99665 10.6633V7.99665M7.99665 5.32999H8.00332M14.6633 7.99665C14.6633 11.6786 11.6786 14.6633 7.99665 14.6633C4.31475 14.6633 1.32999 11.6786 1.32999 7.99665C1.32999 4.31475 4.31475 1.32999 7.99665 1.32999C11.6786 1.32999 14.6633 4.31475 14.6633 7.99665Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: (
    <path
      d="M13.33 4L6.00001 11.33L2.67001 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <>
      <path
        d="M8.39065 1.72401C8.14066 1.47394 7.80157 1.33342 7.44798 1.33334H2.66665C2.31302 1.33334 1.97389 1.47382 1.72384 1.72387C1.47379 1.97392 1.33331 2.31305 1.33331 2.66668V7.44801C1.33339 7.8016 1.47391 8.14069 1.72398 8.39068L7.52665 14.1933C7.82966 14.4944 8.23948 14.6634 8.66665 14.6634C9.09382 14.6634 9.50364 14.4944 9.80665 14.1933L14.1933 9.80668C14.4944 9.50367 14.6634 9.09385 14.6634 8.66668C14.6634 8.23951 14.4944 7.82969 14.1933 7.52668L8.39065 1.72401Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.00002 5.33332C5.18412 5.33332 5.33335 5.18408 5.33335 4.99999C5.33335 4.81589 5.18412 4.66666 5.00002 4.66666C4.81593 4.66666 4.66669 4.81589 4.66669 4.99999C4.66669 5.18408 4.81593 5.33332 5.00002 5.33332Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  x: (
    <>
      <path
        d="M12 4L4 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  calendar: (
    <>
      <path
        d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 1.33334V4.00001"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33331 1.33334V4.00001"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.66666H14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  'circle-alert': (
    <>
      <path
        d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6819 1.33334 7.99998 1.33334C4.31808 1.33334 1.33331 4.31811 1.33331 8.00001C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.33334V8.00001"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.6667H8.00667"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  'credit-card': (
    <path
      d="M1.33331 6.66668H14.6666M3.99998 9.33334H5.33331M2.66665 3.33334H13.3333C14.0697 3.33334 14.6666 3.9303 14.6666 4.66668V11.3333C14.6666 12.0697 14.0697 12.6667 13.3333 12.6667H2.66665C1.93027 12.6667 1.33331 12.0697 1.33331 11.3333V4.66668C1.33331 3.9303 1.93027 3.33334 2.66665 3.33334Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

export function Icon({ name, size = 16, className = '', title }) {
  const content = icons[name]

  if (!content) {
    return null
  }

  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {content}
    </svg>
  )
}
