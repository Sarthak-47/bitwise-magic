import { Step } from '@/types/algorithm';
import { toBinary, addBinary, subtractBinary, shiftRight, fromBinary } from '@/utils/binaryOperations';

// Fast Booth uses 2-bit grouping to reduce operations
export const fastBoothMultiplication = (multiplicand: number, multiplier: number, bits: number = 8): Step[] => {
  const steps: Step[] = [];
  
  // Initialize registers
  let AC = '0'.repeat(bits);
  let MQ = toBinary(multiplier, bits);
  let M = toBinary(multiplicand, bits);
  let Q_1 = '0';
  let count = bits / 2; // Process 2 bits at a time
  
  // Pre-compute -M and -2M for optimization
  const negM = subtractBinary('0'.repeat(bits), M);
  const twoM = addBinary(M, M);
  const negTwoM = subtractBinary('0'.repeat(bits), twoM);
  
  steps.push({
    description: `Initialize: AC = 0, MQ = ${multiplier}, M = ${multiplicand}, Q₋₁ = 0. Fast Booth uses 2-bit grouping.`,
    registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString(), '-M': negM, '2M': twoM },
    highlightedRegisters: ['AC', 'MQ', 'M'],
    operation: 'init'
  });
  
  for (let i = 0; i < count; i++) {
    // Get 3-bit group: MQ₁, MQ₀, Q₋₁
    const mq1 = MQ[bits - 2] || '0';
    const mq0 = MQ[bits - 1];
    const bitGroup = mq1 + mq0 + Q_1;
    
    // Booth recoding table for 3-bit groups
    let operation = 'none';
    let operationDesc = '';
    
    switch (bitGroup) {
      case '000':
      case '111':
        operationDesc = `(${bitGroup}): No operation (0)`;
        operation = 'booth';
        break;
      case '001':
      case '010':
        // Add M
        AC = addBinary(AC, M);
        operationDesc = `(${bitGroup}): Add M (+1)`;
        operation = 'add';
        break;
      case '011':
        // Add 2M
        AC = addBinary(AC, twoM);
        operationDesc = `(${bitGroup}): Add 2M (+2)`;
        operation = 'add';
        break;
      case '100':
        // Subtract 2M
        AC = subtractBinary(AC, twoM);
        operationDesc = `(${bitGroup}): Subtract 2M (-2)`;
        operation = 'subtract';
        break;
      case '101':
      case '110':
        // Subtract M
        AC = subtractBinary(AC, M);
        operationDesc = `(${bitGroup}): Subtract M (-1)`;
        operation = 'subtract';
        break;
    }
    
    steps.push({
      description: `Booth Recode ${operationDesc}`,
      registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: (count - i).toString(), 'Group': bitGroup },
      highlightedRegisters: ['AC'],
      operation: operation as any
    });
    
    // Shift right by 2 positions (arithmetic)
    Q_1 = MQ[bits - 1];
    const mq_minus_2 = MQ[bits - 2];
    
    // Perform 2 arithmetic shifts
    let combined = AC + MQ;
    combined = shiftRight(combined, true);
    combined = shiftRight(combined, true);
    
    AC = combined.substring(0, bits);
    MQ = combined.substring(bits);
    Q_1 = mq_minus_2;
    
    steps.push({
      description: `Arithmetic shift right by 2 positions`,
      registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: (count - i - 1).toString() },
      highlightedRegisters: ['AC', 'MQ'],
      operation: 'shift'
    });
  }
  
  const product = fromBinary(AC + MQ, true);
  
  steps.push({
    description: `Complete: Product = ${product}. Fast Booth reduced operations by ~50%!`,
    registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: '0' },
    highlightedRegisters: ['AC', 'MQ'],
    operation: 'init'
  });
  
  return steps;
};
