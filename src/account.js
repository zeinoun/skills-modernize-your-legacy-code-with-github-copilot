// Minimal Node.js module that mirrors the COBOL account behavior

const MAX_INTEGER_PART = 999999; // PIC 9(6) -> up to 6 integer digits
const MAX_AMOUNT = MAX_INTEGER_PART + 0.99; // 999999.99

let storageBalance = 1000.00; // default as in COBOL's STORAGE-BALANCE

function _validateAmount(value) {
  if (value === null || value === undefined) throw new TypeError('Amount must be provided');
  const num = Number(value);
  if (!Number.isFinite(num)) throw new TypeError('Amount must be a numeric value');
  if (num < 0) throw new RangeError('Amount must be non-negative');
  if (num > MAX_AMOUNT) throw new RangeError('Amount exceeds supported range');
  // Round to 2 decimals to mimic PIC 9(6)V99
  return Math.round(num * 100) / 100;
}

function reset() {
  storageBalance = 1000.00;
}

function getBalance() {
  // Return number with two decimals
  return Math.round(storageBalance * 100) / 100;
}

function credit(amount) {
  const amt = _validateAmount(amount);
  storageBalance = Math.round((storageBalance + amt) * 100) / 100;
  return getBalance();
}

function debit(amount) {
  const amt = _validateAmount(amount);
  if (storageBalance >= amt) {
    storageBalance = Math.round((storageBalance - amt) * 100) / 100;
    return { success: true, balance: getBalance() };
  } else {
    return { success: false, message: 'Insufficient funds', balance: getBalance() };
  }
}

module.exports = {
  reset,
  getBalance,
  credit,
  debit,
  // export constants for tests
  _internal: { MAX_AMOUNT }
};
