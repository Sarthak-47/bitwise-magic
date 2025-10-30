import { Step } from '@/types/algorithm';
import { toBinary, subtractBinary, addBinary, shiftLeft, isNegative, fromBinary } from '@/utils/binaryOperations';

export const nonRestoringDivision = (dividend: number, divisor: number, bits: number = 8): Step[] => {
  const steps: Step[] = [];
  
  if (divisor === 0) {
    throw new Error("Division by zero is undefined");
  }
  
  // Initialize registers
  let AC = '0'.repeat(bits);
  let QR = toBinary(Math.abs(dividend), bits);
  let M = toBinary(Math.abs(divisor), bits);
  let count = bits;
  
  steps.push({
    description: `Initialize: AC = 0, QR = ${Math.abs(dividend)}, M = ${Math.abs(divisor)}, Count = ${bits}`,
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
    
    // Step 2: If AC >= 0, subtract M; else add M
    if (!isNegative(AC)) {
      AC = subtractBinary(AC, M);
      
      steps.push({
        description: `AC ≥ 0: Subtract M from AC`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['AC'],
        operation: 'subtract'
      });
    } else {
      AC = addBinary(AC, M);
      
      steps.push({
        description: `AC < 0: Add M to AC`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['AC'],
        operation: 'add'
      });
    }
    
    // Step 3: Set quotient bit based on AC sign
    if (isNegative(AC)) {
      QR = QR.substring(0, bits - 1) + '0';
      
      steps.push({
        description: `AC < 0: Set QR₀ = 0`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['QR'],
        operation: 'shift'
      });
    } else {
      QR = QR.substring(0, bits - 1) + '1';
      
      steps.push({
        description: `AC ≥ 0: Set QR₀ = 1`,
        registers: { AC, QR, M, Count: count.toString() },
        highlightedRegisters: ['QR'],
        operation: 'add'
      });
    }
    
    count--;
  }
  
  // Final correction if AC is negative
  if (isNegative(AC)) {
    AC = addBinary(AC, M);
    
    steps.push({
      description: `Final correction: AC < 0, so AC = AC + M`,
      registers: { AC, QR, M, Count: '0' },
      highlightedRegisters: ['AC'],
      operation: 'add'
    });
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
