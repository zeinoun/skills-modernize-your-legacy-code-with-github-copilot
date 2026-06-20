#!/usr/bin/env node
// Node.js port of the COBOL Account Management application
const rl = require('readline-sync');

const MAX_INTEGER_PART = 999999; // PIC 9(6)
const MAX_AMOUNT = 999999.99;
let STORAGE_BALANCE = 1000.00; // initial default

function formatBalance(num) {
  const fixed = Math.abs(num).toFixed(2); // two decimals
  const parts = fixed.split('.');
  const intPart = parts[0].padStart(6, '0');
  return `${intPart}.${parts[1]}`;
}

function DataProgram(operation, balanceObj) {
  // balanceObj is an object {value: number} to emulate pass-by-reference
  const op = String(operation).trim().toUpperCase();
  if (op === 'READ') {
    balanceObj.value = STORAGE_BALANCE;
  } else if (op === 'WRITE') {
    STORAGE_BALANCE = Math.round(balanceObj.value * 100) / 100;
  }
}

function Operations(passedOperation) {
  const opType = String(passedOperation).padEnd(6, ' ').toUpperCase();
  if (opType === 'TOTAL ') {
    const balRef = { value: 0 };
    DataProgram('READ', balRef);
    console.log('Current balance: ' + formatBalance(balRef.value));
  } else if (opType === 'CREDIT') {
    const input = rl.question('Enter credit amount: ');
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount < 0) {
      console.log('Invalid amount. Operation cancelled.');
      return;
    }
    const balRef = { value: 0 };
    DataProgram('READ', balRef);
    balRef.value = Math.round((balRef.value + amount) * 100) / 100;
    DataProgram('WRITE', balRef);
    console.log('Amount credited. New balance: ' + formatBalance(balRef.value));
  } else if (opType === 'DEBIT ') {
    const input = rl.question('Enter debit amount: ');
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount < 0) {
      console.log('Invalid amount. Operation cancelled.');
      return;
    }
    const balRef = { value: 0 };
    DataProgram('READ', balRef);
    if (balRef.value >= amount) {
      balRef.value = Math.round((balRef.value - amount) * 100) / 100;
      DataProgram('WRITE', balRef);
      console.log('Amount debited. New balance: ' + formatBalance(balRef.value));
    } else {
      console.log('Insufficient funds for this debit.');
    }
  } else {
    console.log('Unknown operation: ' + passedOperation);
  }
}

function main() {
  let continueFlag = true;
  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = rl.question('Enter your choice (1-4): ');
    switch (choice.trim()) {
      case '1':
        Operations('TOTAL ');
        break;
      case '2':
        Operations('CREDIT');
        break;
      case '3':
        Operations('DEBIT ');
        break;
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  main();
}
