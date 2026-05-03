# UX Design Best Practices: Lead Generation & Order Flows

This skill document outlines the core principles and actionable best practices for creating high-conversion, mobile-first lead generation wizards and order flows.

## 1. Extreme Mobile-First Optimization
Since 90% of traffic and conversions occur on mobile devices, the mobile experience must mimic a native app.
- **Prevent Auto-Zoom:** iOS Safari automatically zooms in on inputs if their `font-size` is less than 16px. To prevent this "zoom in effect" and maintain the UI layout, either ensure all inputs (`input`, `select`, `textarea`) have a `font-size` of at least `16px` or use `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">`.
- **Full-Screen Drawers:** Use full-height bottom sheets or side drawers (e.g., 90vh - 100vh) for complex interactions (like date selection) instead of tiny popups or modals that can cause accidental dismissals.
- **Native-like Interactions:** Replace hover effects with tactile tap states (`:active`). Ensure tap targets are at least 48x48px.

## 2. Frictionless Input Mechanisms
- **Continuous Scroll Calendars:** Standard desktop calendars (like Flatpickr) with left/right arrows are clunky on mobile. Use a vertical, continuous-scroll calendar where users simply scroll down to see future months and tap to select dates (similar to Airbnb or flight booking apps).
- **Stepped Wizards, Not Long Forms:** Break the order flow into micro-commitments. One question or group of related questions per step. 
- **Auto-Advance:** When a user makes a definitive selection (like choosing a group size or a specific date without needing a time), auto-advance them to the next step.
- **Smart Defaults:** Pre-fill dates (e.g., "today" or "+1 day"), group sizes (e.g., "2 adults"), and contact methods to reduce cognitive load.

## 3. High-Conversion Layout Principles
- **No "Popup Inside a Popup":** Never open a modal on top of a modal/drawer. If a user is in a drawer and clicks a date input, transition the current drawer to the calendar view, or slide in a new dedicated full-screen view. 
- **Clear Typography & Contrast:** Use legible fonts and high contrast. Remove dark backgrounds on text-heavy interactive elements like calendars to improve readability. Ensure headings are descriptive (e.g., "Select Date" instead of "Date").
- **Sticky Actions:** Keep the primary Call to Action (CTA) button sticky at the bottom of the viewport on mobile so it's always accessible by the thumb.

## 4. Trust & Context
- **Constant Context:** Always show the user *what* they are booking and *how much* it costs (if applicable). Use a sticky header or a concise summary card that persists across steps.
- **Transparent Pricing:** If there are addons or variable costs, show the price changes immediately.
- **Reassurance:** Add micro-copy near the final submit button (e.g., "No credit card required", "Our concierge will reply in 15 minutes").
