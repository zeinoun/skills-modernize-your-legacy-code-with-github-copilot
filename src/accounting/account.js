// account module for src/accounting app
const MAX_INTEGER_PART = 999999;
const MAX_AMOUNT = 999999.99;
let STORAGE_BALANCE = 1000.00;

function reset() { STORAGE_BALANCE = 1000.00; }
function getBalance() { return Math.round(STORAGE_BALANCE * 100) / 100; }

function _validateAmount(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new TypeError('Amount must be numeric');
  if (num < 0) throw new RangeError('Amount must be non-negative');
  if (num > MAX_AMOUNT) throw new RangeError('Amount exceeds supported range');
  return Math.round(num * 100) / 100;
}

function credit(amount) {
  const amt = _validateAmount(amount);
  STORAGE_BALANCE = Math.round((STORAGE_BALANCE + amt) * 100) / 100;
  return getBalance();
}

function debit(amount) {
  const amt = _validateAmount(amount);
  if (STORAGE_BALANCE >= amt) {
    STORAGE_BALANCE = Math.round((STORAGE_BALANCE - amt) * 100) / 100;
    return { success: true, balance: getBalance() };
  } else {
    return { success: false, message: 'Insufficient funds', balance: getBalance() };
  }
}

module.exports = { reset, getBalance, credit, debit, _internal: { MAX_AMOUNT } };
