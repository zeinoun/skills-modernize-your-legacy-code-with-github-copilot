const acc = require('../account');

beforeEach(() => acc.reset());

describe('Accounting app unit tests (mirroring TESTPLAN)', () => {
  test('TC-01 View initial balance', () => {
    expect(acc.getBalance()).toBe(1000.00);
  });

  test('TC-02 Credit a positive amount', () => {
    acc.credit(50.25);
    expect(acc.getBalance()).toBe(1050.25);
  });

  test('TC-03 Debit with sufficient funds', () => {
    acc.credit(200);
    const r = acc.debit(100);
    expect(r.success).toBe(true);
    expect(r.balance).toBe(1100.00);
  });

  test('TC-04 Debit with insufficient funds', () => {
    const r = acc.debit(2000.00);
    expect(r.success).toBe(false);
    expect(r.message).toBe('Insufficient funds');
  });

  test('TC-05 Exit (reset) behaviour', () => {
    acc.credit(10);
    acc.reset();
    expect(acc.getBalance()).toBe(1000.00);
  });

  test('TC-07 Non-numeric credit input', () => {
    expect(() => acc.credit('abc')).toThrow(TypeError);
  });

  test('TC-08 Non-numeric debit input', () => {
    expect(() => acc.debit('xyz')).toThrow(TypeError);
  });

  test('TC-09 Zero amount credit/debit', () => {
    acc.credit(0);
    expect(acc.getBalance()).toBe(1000.00);
    const res = acc.debit(0);
    expect(res.success).toBe(true);
    expect(res.balance).toBe(1000.00);
  });

  test('TC-10 Large amount exceeding PIC limits', () => {
    const max = acc._internal.MAX_AMOUNT;
    expect(() => acc.credit(max + 1)).toThrow(RangeError);
  });

  test('TC-11 Persistence across runs simulated by reset', () => {
    acc.credit(100);
    expect(acc.getBalance()).toBe(1100.00);
    acc.reset();
    expect(acc.getBalance()).toBe(1000.00);
  });

  test('TC-13 Formatting assert numeric two-decimal', () => {
    acc.credit(50.25);
    expect(acc.getBalance()).toBeCloseTo(1050.25, 2);
  });
});
