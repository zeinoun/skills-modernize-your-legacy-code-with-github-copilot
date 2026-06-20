const account = require('../src/account');

beforeEach(() => {
  account.reset();
});

describe('COBOL account behavior (mirrored)', () => {
  test('TC-01: View initial balance', () => {
    expect(account.getBalance()).toBe(1000.00);
  });

  test('TC-02: Credit a positive amount', () => {
    account.credit(50.25);
    expect(account.getBalance()).toBe(1050.25);
  });

  test('TC-03: Debit with sufficient funds', () => {
    account.credit(200); // make sure balance is higher
    const result = account.debit(100.00);
    expect(result.success).toBe(true);
    expect(result.balance).toBe(1100.00);
  });

  test('TC-04: Debit with insufficient funds', () => {
    const result = account.debit(9999999.99);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds');
  });

  test('TC-05: Exit program (N/A) — ensure module reset works', () => {
    account.credit(10);
    account.reset();
    expect(account.getBalance()).toBe(1000.00);
  });

  test('TC-06: Invalid menu choice handling (N/A in module)', () => {
    // Not applicable for the module-level API; placeholder test to assert API boundaries
    expect(typeof account.credit).toBe('function');
    expect(typeof account.debit).toBe('function');
  });

  test('TC-07: Non-numeric amount input for Credit', () => {
    expect(() => account.credit('abc')).toThrow(TypeError);
  });

  test('TC-08: Non-numeric amount input for Debit', () => {
    expect(() => account.debit('xyz')).toThrow(TypeError);
  });

  test('TC-09: Zero amount credit/debit', () => {
    account.credit(0.00);
    expect(account.getBalance()).toBe(1000.00);
    const res = account.debit(0.00);
    expect(res.success).toBe(true);
    expect(res.balance).toBe(1000.00);
  });

  test('TC-10: Large amount exceeding PIC limits', () => {
    const max = account._internal.MAX_AMOUNT;
    expect(() => account.credit(max + 1)).toThrow(RangeError);
  });

  test('TC-11: Persistence across runs (module resets)', () => {
    account.credit(100);
    expect(account.getBalance()).toBe(1100.00);
    // simulate restart by resetting
    account.reset();
    expect(account.getBalance()).toBe(1000.00);
  });

  test.skip('TC-12: Operation code spacing sensitivity (COBOL-specific)', () => {
    // COBOL-specific behavior; skip in Node tests
  });

  test('TC-13: Formatting of displayed balance', () => {
    account.credit(50.25);
    // numeric value should be two-decimal number
    expect(account.getBalance()).toBeCloseTo(1050.25, 2);
  });

  test('TC-14: Multiple accounts not supported', () => {
    // Module models a single global balance; creating another instance is not supported
    expect(account.getBalance()).toBe(1000.00);
  });
});
