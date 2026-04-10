# Karrot Prototype Context

## Document Purpose
This document is for context sharing only.

It exists to explain the background, product intent, and high-level direction of the project so the same context can be reused across threads and collaborators.

This document is **not**:

- an implementation spec
- a task list
- a final UX definition
- a direct instruction to build every idea described here

Actual build scope and execution order should be determined by:

- `docs/roadmap.md`
- `docs/implementation-principles.md`
- explicit implementation requests in the working thread

## Overview
This project is a prototype of a Karrot-like app.

The goal is not to fully recreate Karrot feature-by-feature. The real purpose is to:

- understand the current user flow
- introduce improved to-be entry points and interaction design
- observe whether those changes can shift user behavior and metrics

## Current Product Direction
We do not want to go too deep into every screen right now.

Instead, we are planning to:

- implement the full bottom tab structure
- give every bottom tab at least a minimal landing state
- selectively go deeper only in the tabs and flows that matter most to the experiment

## Testing Environment Context
For the current prototype stage, validation and usability testing are planned to happen only in a mobile environment.

Because of that, implementation and UI decisions should prioritize the mobile experience first.

However, this should not be interpreted as permission to build a non-responsive app.

The intended interpretation is:

- mobile is the primary test environment
- mobile usability is the first priority for layout and interaction decisions
- the product should still behave responsively outside the mobile viewport
- larger screens should remain usable and visually coherent even if they are not the primary validation target

## Core Goal
The most important long-term goal is to increase traffic into `동네지도` from the bottom navigation.

This means the project should be treated as a prototype for validating:

`How can we increase entry into 동네지도 from the main used-car marketplace home flow?`

## Key Product Hypothesis
Users spend a lot of time in the secondhand marketplace home flow.

Because of that, `동네지도` should not be treated only as a separate destination in the bottom tab.
Instead, it should gain traffic from meaningful entry points embedded inside the home experience.

In short:

- home is the highest-traffic behavior surface
- 동네지도 is the feature we want to grow
- the experiment is about connecting those two more effectively

## Product Strategy
The current strategy is:

1. build the full bottom tab IA first
2. keep each tab lightweight at the beginning
3. prioritize `홈` and `동네지도`
4. focus the main experiment on `홈 -> 동네지도` transition points
5. treat other flows such as detail/chat as supporting context, not the primary KPI

## Scope Priority
### Highest priority
- Home
- Neighborhood Map
- Entry points from Home to Neighborhood Map

### Secondary priority
- Item detail
- Chat
- Other bottom-tab destinations with lightweight placeholder or starter states

## Example Experiment Directions
Possible entry-point ideas from home to neighborhood map:

- top quick action or banner on the home feed
- contextual recommendation module inserted between item cards
- location-based CTA inside item detail

The current thinking is that a contextual entry point inside the home feed is the strongest first experiment, because it fits naturally into the browsing behavior users already have.

## One-Sentence Summary
This project is not just a Karrot clone.
It is a prototype for testing whether better entry points from the marketplace home flow can increase traffic into `동네지도`.

## Usage Note
If this document is referenced in another thread, it should be treated as shared product context only.

It should help explain:

- why the project exists
- what the main business goal is
- which direction the team is currently considering

It should not be interpreted as a request to implement all described concepts immediately.
