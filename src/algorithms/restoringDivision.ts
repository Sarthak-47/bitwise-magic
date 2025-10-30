import { Step } from '@/types/algorithm';
import { toBinary, subtractBinary, shiftLeft, addBinary, isNegative, fromBinary } from '@/utils/binaryOperations';

export const restoringDivision = (dividend: number, divisor: number, bits: number = 8): Step[] => {
  const steps: Step[] = [];
  
  if (divisor === 0) {
    throw new Error("Division by zero is undefined");
  }
  
  // Initialize registers
  let AC = '0'.repeat(bits); // Accumulator
  let QR = toBinary(Math.abs(dividend), bits); // Quotient Register (initially holds dividend)
  let M = toBinary(Math.abs(divisor), bits); // Divisor
  let count = bits;
  
  steps.push({
    description: `Initialize: AC = 0, QR = ${Math.abs(dividend)} (dividend), M = ${Math.abs(divisor)} (divisor), Count = ${bits}`,
    registers: { AC, QR, M, Count: count.toString() },
    highlightedRegisters: ['AC', 'QR', 'M'],
    operation: 'init'
  });
  
  while (count > 0) {
    // Step 1: Shift left AC and QR
    const combined = AC + QR;
    const shifted = shiftLeft(combined);
    AC = shifted.substring(0, bits);
    QR = shifted.substring(bits);
    
    steps.push({
      description: `Shift left AC and QR`,
      registers: { AC, QR, M, Count: count.toString() },
      highlightedRegisters: ['AC', 'QR'],
      operation: 'shift'
    });
    
    // Step 2: Subtract M from AC
    const prevAC = AC;
    AC = subtractBinary(AC, M);
    
    steps.push({
      description: `Subtract M from AC: AC = AC - M`,
      registers: { AC, QR, M, Count: count.toString() },
      highlightedRegisters: ['AC'],
      operation: 'subtract'
    });
    
    // Step 3: Check if result is negative
    if (isNegative(AC)) {
      // Restore AC
      AC = prevAC;
      // Set Q0 = 0
      QR = QR.substring(0, bits - 1) + '0';
      
      steps.push({
        description: `AC < 0: Restore AC, set QR₀ = 0`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['AC', 'QR'],
        operation: 'restore'
      });
    } else {
      // Set Q0 = 1
      QR = QR.substring(0, bits - 1) + '1';
      
      steps.push({
        description: `AC ≥ 0: Keep AC, set QR₀ = 1`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['QR'],
        operation: 'add'
      });
    }
    
    count--;
  }
  
  const quotient = fromBinary(QR, false);
  const remainder = fromBinary(AC, false);
  
  steps.push({
    description: `Complete: Quotient = ${quotient}, Remainder = ${remainder}`,
    registers: { AC, QR, M, Count: '0' },
    highlightedRegisters: ['QR', 'AC'],
    operation: 'init'
  });
  
  return steps;
};
