# Test Plan for COBOL Account Management Application

This test plan covers the current business logic implemented in the COBOL app (`MainProgram`, `Operations`, `DataProgram`). Use these cases to validate behavior with business stakeholders. Record Actual Result, Status and Comments during validation.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View initial balance | Program freshly started (no prior operations in session) | 1. Run the program (`./accountsystem`) 2. Choose `1` (View Balance) | Displays the current balance equal to default `1000.00` (formatted as `001000.00`) |  |  |  |
| TC-02 | Credit a positive amount | Program running; initial or known balance available | 1. Choose `2` (Credit) 2. Enter `50.25` when prompted | Program displays `Amount credited. New balance: 001050.25` (balance increased by 50.25) |  |  |  |
| TC-03 | Debit with sufficient funds | Program running; balance >= debit amount | 1. Choose `3` (Debit) 2. Enter `100.00` when prompted | Program debits amount, updates balance, and displays new balance (previous balance - 100.00) |  |  |  |
| TC-04 | Debit with insufficient funds | Program running; balance < requested debit | 1. Choose `3` (Debit) 2. Enter an amount larger than current balance (e.g., `9999999.99`) | Program displays `Insufficient funds for this debit.` and balance remains unchanged |  |  |  |
| TC-05 | Exit program | Program running | 1. Choose `4` (Exit) | Program displays exit message `Exiting the program. Goodbye!` and terminates |  |  |  |
| TC-06 | Invalid menu choice handling | Program running | 1. Enter an invalid menu option (e.g., `9` or `a`) at prompt | Program displays `Invalid choice, please select 1-4.` and re-displays the menu |  |  |  |
| TC-07 | Non-numeric amount input for Credit | Program running; choose `2` | 1. Choose `2` (Credit) 2. Enter a non-numeric value (e.g., `abc`) when prompted for amount | Behavior: The current implementation does minimal validation — observe whether the program rejects input, hangs, or treats input as zero. Expected: program should handle gracefully (for stakeholders, note actual behavior and recommend validation). |  |  |  |
| TC-08 | Non-numeric amount input for Debit | Program running; choose `3` | 1. Choose `3` (Debit) 2. Enter a non-numeric value (e.g., `xyz`) when prompted | Behavior: Minimal validation present; record whether program rejects input or behaves unexpectedly. Expected: graceful input validation (recommendation). |  |  |  |
| TC-09 | Zero amount credit/debit | Program running | 1. Choose `2` (Credit) and enter `0.00` 2. Choose `3` (Debit) and enter `0.00` | Expected: balance unchanged, operations should complete successfully and display the same balance |  |  |  |
| TC-10 | Large amount exceeding PIC limits | Program running | 1. Choose `2` (Credit) and enter a value larger than `PIC 9(6)V99` supports (e.g., `1000000.00`) | Expected: COBOL numeric overflow or truncation may occur; capture actual behavior; recommend validation/limits |  |  |  |
| TC-11 | Persistence across runs | Ensure prior run had credited/debited balance | 1. Run program, perform credit/debit and exit 2. Re-run program and view balance | Expected: current implementation uses in-memory `WORKING-STORAGE` and does NOT persist across runs; balance should reset to default `1000.00` on new run |  |  |  |
| TC-12 | Operation code spacing sensitivity (internal behavior) | Developer-level test (call `Operations` with different spacing) | 1. (Developer) Call `Operations` or inspect call sites to pass `DEBIT` vs `DEBIT ` vs `CREDIT` with/without padding | Expected: The system compares 6-char fields; mismatched padding may cause incorrect behavior — document exact behavior |  |  |  |
| TC-13 | Formatting of displayed balance | Program running | 1. View balance after several operations | Expected: Values displayed with leading zeros and two decimals (e.g., `001050.25`) |  |  |  |
| TC-14 | Concurrent operations / Multiple accounts (not supported) | N/A | 1. Attempt to operate on separate accounts (no UI support) | Expected: System manages a single global balance only; multiple accounts not supported — record stakeholder acceptance or requirement to extend |  |  |  |


Notes for stakeholders and testers
- The application currently manages a single in-memory balance (`STORAGE-BALANCE`) and does not persist changes after the process ends (see TC-11).
- Input validation is minimal. Several test cases (TC-07, TC-08, TC-10) are intentionally designed to surface input-handling issues; capture Actual Result and classify severity.
- Monetary format uses `PIC 9(6)V99` — tests should include values near the limits of this format to validate overflow/truncation behavior.
- Operation codes are fixed-width 6-character strings; any future API or Node.js port should normalize/pad codes consistently to avoid spacing issues.

How to use this test plan
- For each test row, execute the Test Steps, then fill in `Actual Result`, `Status`, and `Comments`.
- Use this plan in stakeholder sign-off meetings; any failing test should be discussed for remediation priority and acceptance criteria.

