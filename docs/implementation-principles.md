# Implementation Principles

## Document Purpose
This document captures implementation principles that should remain stable even as the prototype grows.

The goal is to reduce rework later and make sure the app can evolve from a design-driven prototype into a product-like implementation.

This document should be used as a guardrail for how we implement things.

This document is **not**:

- a product strategy document
- a feature roadmap
- a screen-by-screen task list

For project background, use `docs/product-context.md`.
For execution order and active tasks, use `docs/roadmap.md`.

## Usage Note
If this document is referenced in another thread, it should be interpreted as a set of stable implementation rules.

It should help answer questions like:

- how should data be structured right now?
- how should future backend migration be considered?
- how should responsive behavior be interpreted?
- how should mobile-first implementation be prioritized during testing?

It should not be used as a request to build every possible supporting system immediately.

## Data Source Principle
For now, the project uses mock or dummy data, including data derived from Figma-based design work.

However, this is only the temporary source of truth for the prototype stage.

The long-term plan is to introduce Supabase as the real backend and fetch actual data from the database.

Because of that, all implementation should follow this rule:

`Use mock data now, but structure the app so that the data source can later be replaced by Supabase with minimal UI rewrites.`

## Practical Rules
- Do not tightly couple screen components to hardcoded mock data structures when avoidable.
- Prefer separating UI rendering from data access.
- Keep domain types stable even if the current data is mocked.
- Treat mock data as a temporary adapter, not the final architecture.
- Avoid patterns that require rewriting screens from scratch when real fetching is introduced.

## Responsive UI Principle
This project should be built responsively, with a mobile-first implementation priority.

The reason is operational, not stylistic:

- the current prototype will be tested only in a mobile environment
- mobile usability is therefore the primary acceptance criteria for this stage

Even when a screen is designed or validated with mobile-first thinking, that should not be interpreted as:

- locking the product into a fake mobile device frame
- forcing all pages into a fixed narrow viewport container
- treating desktop or larger screens as an afterthought
- ignoring how the layout behaves beyond the primary mobile test width

The correct interpretation is:

- use a mobile-first design approach
- optimize first for common mobile viewport behavior, spacing, hierarchy, and touch interaction
- treat mobile layout quality as the default baseline for implementation decisions
- ensure layouts adapt naturally across screen sizes
- allow the real browser viewport to define the canvas
- avoid artificial device wrappers unless a specific demo scenario explicitly requires one

## Responsive Practical Rules
- Do not wrap the whole app in a fake phone frame by default.
- Start layout and component decisions from the mobile viewport first.
- Prioritize touch-friendly spacing, tap targets, and readable hierarchy on small screens.
- Prefer responsive layout systems over fixed device-sized containers.
- Design components so they work cleanly on mobile first, then scale to larger widths.
- Use breakpoint-aware spacing and layout decisions when needed.
- When tradeoffs exist, protect the mobile test experience first, then refine larger breakpoints.
- If a mobile mock is shown, treat it as a visual reference, not as a requirement to constrain the implementation canvas.

## Change Scope Principle
When implementing a specific page or feature, do not arbitrarily modify the UI of unrelated pages.

For example:

- if the task is to implement the community page, only change the community page
- do not restyle or restructure other pages unless that work is explicitly requested

If a broader cross-page change is truly necessary, the implementer should:

- explain why the wider change is needed
- describe the impact clearly
- ask for permission before proceeding

## Change Scope Practical Rules
- Keep changes scoped to the requested screen or feature by default.
- Do not "clean up" unrelated pages as a side effect of the task.
- Do not apply visual consistency changes across the app unless requested.
- If a shared component must be changed and that will affect other screens, call that out first.
- Prefer local changes over broad UI refactors when fulfilling a targeted request.

## Clarification Principle
If something is unclear during implementation, do not silently decide it alone.

When important ambiguity exists, the implementer should ask the user for clarification in enough detail to support a good decision.

This is especially important when the uncertainty affects:

- layout or UX direction
- feature scope
- interaction behavior
- data structure
- shared component impact
- changes that may affect other pages

## Clarification Practical Rules
- Do not guess when the decision could materially change the output.
- Do not invent product intent when it has not been clearly established.
- Ask detailed clarifying questions when needed instead of forcing a best guess.
- Surface assumptions clearly if temporary assumptions must be made.
- Prefer clarification over rework when the uncertainty is meaningful.

## Recommended Direction
- Store mock data in dedicated data or domain layers.
- Keep page and component code focused on presentation and interaction.
- Make it possible to swap:
  - `local mock data`
  - `Figma-derived dummy data`
  - `Supabase-fetched real data`
  without redesigning the screen structure.

## Future Backend Direction
When Supabase is introduced later:

- database-backed content should replace the mock source gradually
- the fetch layer should change before the UI layer
- existing screen contracts should remain as stable as possible

## One-Line Rule
Current implementation rule:

`Prototype with mock data now, but design the structure for an eventual Supabase-backed app.`
