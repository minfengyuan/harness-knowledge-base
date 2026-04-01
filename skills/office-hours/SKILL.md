---
name: office-hours
description: Use when a user wants to brainstorm a product idea, test whether something is worth building, or shape an early design before implementation
---

# Office Hours

## Overview

Use this skill to pressure-test an idea before code exists.

It has two modes:
- **Startup mode**: expose demand reality, status quo, urgency, wedge, observation, and why now.
- **Builder mode**: help shape side projects, internal tools, experiments, learning projects, and open source ideas into a concrete design direction.

**Core principle:** do not jump into implementation before the problem, user, and wedge are clear.

## When to Use

Use this skill when the user:
- asks to brainstorm an idea
- asks whether something is worth building
- wants help thinking through a product direction
- wants to shape an idea before writing code
- has a fuzzy concept and needs a sharper design doc

Do not use this skill when:
- the user already has a decision-complete implementation plan
- the task is a straightforward bug fix or code change
- the user only needs execution, not ideation

## Mode Selection

### Startup mode

Use for startups, products, monetized tools, or anything where demand matters.

Drive the conversation through six forcing questions:
1. Who is the user, exactly?
2. What painful status quo are they using now?
3. What makes the problem urgent rather than nice-to-have?
4. What is the narrowest wedge that delivers value quickly?
5. What direct observation or evidence supports this idea?
6. Why is now the right time for this to exist?

Push until answers are specific, concrete, and falsifiable.

### Builder mode

Use for side projects, internal tools, prototypes, hackathons, learning projects, or open source.

Focus on:
- what should exist at the end
- who will use it first
- what success looks like in the first version
- what can be cut without losing the core idea
- what risks or unknowns need to be resolved early

## Process

### Step 1: Understand the idea

Start by restating the idea in one or two clear sentences.

Then identify:
- target user or audience
- current problem or friction
- current alternative or workaround
- intended outcome if this works

If these are unclear, ask the user directly and keep narrowing.

### Step 2: Choose the right mode

- Use **startup mode** if the user is trying to validate a market or product opportunity.
- Use **builder mode** if the user is shaping something to build regardless of commercial validation.

If both apply, start with startup mode, then switch to builder mode after the problem and wedge are clear.

### Step 3: Pressure-test the idea

For startup mode:
- challenge vague claims like "teams need this" or "people want this"
- ask for observed behavior, not just beliefs
- separate urgency from general usefulness
- identify the smallest credible first version

For builder mode:
- convert the idea into a bounded first version
- identify primary user flow
- identify inputs, outputs, and constraints
- list open questions that must be answered before implementation

### Step 4: Produce a structured output

Always end with a compact design artifact the user can act on.

## Output Format

Produce a structured design summary with these sections:

```markdown
# Idea Summary

## Problem
- What problem exists
- Who has it
- What they do today

## Users
- Primary user
- Early adopter profile

## Wedge
- Smallest useful first version
- What is explicitly out of scope

## Evidence
- Observations, examples, or assumptions
- What still needs validation

## Risks
- Main product or technical risks
- Unknowns that could invalidate the idea

## Recommended Next Step
- The single best next action
```

If the user asks for a longer artifact, expand this into a design doc. Do not assume a repository path. Only write to a file if the user explicitly provides or approves a destination.

## Guidance for Questions

When asking questions:
- ask one high-leverage question at a time
- prefer specific questions over broad prompts
- force examples and observed behavior where possible
- do not let the conversation stay abstract

Good:
- "Who felt this pain most recently?"
- "What are they doing instead today?"
- "What would a first user pay with time, money, or trust to get this solved?"

Bad:
- "Tell me more"
- "What do you think?"
- "Any other ideas?"

## Decision Rules

Recommend moving toward implementation only when:
- the user is clear
- the first version is narrow
- the audience is identifiable
- the main unknowns are visible

Recommend more discovery when:
- the user is solving for everyone
- the first version has no wedge
- the evidence is weak or purely speculative
- the task mixes strategy and implementation prematurely

## Integration

This skill works well before deeper plan reviews.

If the idea is still fuzzy, run this skill first.
If the idea is already shaped and needs product-scope critique, use `plan-ceo-review` next.
If the idea already has an implementation plan and needs engineering critique, use `plan-eng-review` next.
