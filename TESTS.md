# Tests

## Overview

SpendLens includes automated tests for the core audit engine. I focused the test coverage on `lib/audit-engine.ts` because this is the most important business-logic layer in the product. The UI can change, but the savings calculation and recommendation logic must remain reliable.

## How to Run Tests

npm test

This runs:

vitest run
Test File
tests/audit-engine.test.ts
Automated Tests Written
1. Inflated spend detection

Test: detects inflated spend above expected plan cost

This checks that SpendLens detects when a user enters spend that is higher than the expected plan cost for a tool, plan, and seat count.

2. Coding assistant overlap

Test: detects coding assistant overlap

This checks that using Cursor and GitHub Copilot together for a coding-focused team triggers savings detection because the tools may overlap.

3. API spend credit opportunity

Test: flags high API spend as a credit opportunity

This checks that high OpenAI API spend creates a savings recommendation based on discounted infrastructure credit opportunities.

4. Efficient low-cost stack

Test: returns zero savings for an efficient low-cost stack

This checks that SpendLens does not manufacture fake savings when the user’s stack already looks reasonable.

5. Priority classification

Test: assigns high priority to large savings opportunities

This checks that large savings opportunities are marked as high priority so the user can act on the most important recommendation first.

## Why These Tests Matter

The audit engine is the part of SpendLens that users must trust. These tests cover the major recommendation categories:

inflated spend
tool overlap
high API spend
honest zero-savings cases
priority ranking
Current Limitations

The current tests focus on business logic, not visual components. If this project continued, I would add:

form validation tests
API route tests
lead capture tests
public report page tests
end-to-end tests with Playwright
Latest Local Test Result

## At the time of writing:

Test Files  1 passed
Tests       5 passed

