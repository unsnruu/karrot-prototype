# Karrot Prototype Architecture

## Document Purpose
This document defines the intended code structure for the project.

It exists to explain:

- how page-level code should be organized
- how responsibilities should be separated
- where new code should usually live
- what tradeoffs are acceptable as the prototype grows

This document is **not**:

- a product strategy document
- a feature roadmap
- a visual design spec
- a strict rule that every file must follow mechanically

For product background, use `docs/product-context.md`.
For build order and current priorities, use `docs/roadmap.md`.
For stable implementation rules across data, responsiveness, and change scope, use `docs/implementation-principles.md`.

## Usage Scope
This document should be used when:

- adding a new route
- refactoring a page that has grown too large
- deciding where data fetching should live
- deciding whether a UI element belongs to a screen, feature component, or shared component
- reviewing whether a file mixes too many responsibilities

This document should not be used as a reason to perform broad refactors without an explicit request.

## Core Principle
The project should separate:

- data fetching
- screen or layout composition
- small UI components

The goal is to keep route concerns, screen concerns, and reusable UI concerns from collapsing into one large file.

In short:

`Fetch data in routes, compose pages in screens, and render details in smaller components.`

## Recommended Structure
### 1. Route entry
Location:

- `app/**/page.tsx`

Primary responsibility:

- define the route entry
- read `params` and `searchParams`
- perform server-side data fetching
- handle `redirect`, `notFound`, and route-level control flow
- pass prepared data into the next UI layer

This layer should usually avoid holding large page markup.

### 2. Screen composition
Location:

- `features/**/screens/*`

Primary responsibility:

- assemble the full screen layout
- coordinate feature-level sections
- receive already-fetched data as props
- keep the screen readable even when the page grows

This layer is where page-sized UI composition belongs.

### 3. Feature components
Location:

- `features/**/components/*`

Primary responsibility:

- render smaller pieces of a feature screen
- support one feature area without pretending to be globally reusable
- isolate local UI logic that would otherwise bloat the screen file

Examples:

- list items
- headers specific to a feature
- cards used only inside one feature area
- local interactive widgets

### 4. Shared components
Location:

- `components/**`

Primary responsibility:

- hold UI that is meaningfully shared across multiple features or screens
- expose generic or cross-feature building blocks

Examples:

- navigation
- shared layout primitives
- buttons, modals, or reusable common UI patterns

This directory should not become a place where full pages are hidden under the name "component".

## Responsibility Boundaries
When choosing where code belongs, prefer the following rule:

- If it knows about routing, params, redirects, or server fetching, it belongs closer to `app`.
- If it represents a full page-sized UI, it belongs in `features/**/screens`.
- If it is a smaller piece used by one feature, it belongs in `features/**/components`.
- If it is reused across features, it belongs in `components/**`.

## Client and Server Guidance
Prefer keeping the client boundary as small as possible.

That means:

- do not turn a full screen into a client component when only one interactive part needs it
- keep server-renderable layout and content on the server when practical
- isolate local interactivity into small client components

Preferred pattern:

- route fetches data
- screen stays server-compatible when possible
- only interactive islands use `"use client"`

## Why This Structure Exists
This structure is recommended because it improves:

- readability of route files
- clarity of ownership
- flexibility when data sources change
- ability to refactor a screen without touching route logic
- ability to reuse smaller UI pieces without moving a whole page around

It also helps the team reason about changes more safely:

- route changes affect routing and data flow
- screen changes affect layout and page composition
- component changes affect local UI details

## Acceptable Exceptions
This structure is a default, not a law.

It is acceptable to keep markup directly inside `app/**/page.tsx` when:

- the route is very small
- the UI is unlikely to grow
- the page is truly one-off
- adding another file would create more ceremony than clarity

A good rule of thumb:

- if a page is tiny, keep it simple
- if a page starts mixing route logic and large UI composition, split it

## Practical Review Questions
When reviewing a page or planning new code, ask:

- Does this route file mostly describe routing and data flow, or is it becoming a giant UI file?
- Is this page-sized UI really a reusable component, or is it actually a screen?
- Is this component shared enough to belong in `components/**`, or is it feature-specific?
- Can the client boundary be made smaller?
- If the data source changes later, will the UI layer stay mostly stable?

## One-Line Rule
Default architecture rule:

`Use app for route entry and fetching, screens for page composition, and components for smaller UI pieces.`
