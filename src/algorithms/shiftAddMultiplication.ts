import { Step } from '@/types/algorithm';
import { toBinary, addBinary, shiftRight, fromBinary } from '@/utils/binaryOperations';

export const shiftAddMultiplication = (multiplicand: number, multiplier: number, bits: number = 8): Step[] => {
  const steps: Step[] = [];
  
  // Initialize registers
  let AC = '0'.repeat(bits); // Accumulator
  let MQ = toBinary(Math.abs(multiplier), bits); // Multiplier
  let M = toBinary(Math.abs(multiplicand), bits); // Multiplicand
  let count = bits;
  
  steps.push({
    description: `Initialize: AC = 0, MQ = ${Math.abs(multiplier)} (multiplier), M = ${Math.abs(multiplicand)} (multiplicand), Count = ${bits}`,
    registers: { AC, MQ, M, Count: count.toString() },
    highlightedRegisters: ['AC', 'MQ', 'M'],
    operation: 'init'
  });
  
  while (count > 0) {
    // Check LSB of MQ (MQ₀)
    const mq0 = MQ[bits - 1];
    
    if (mq0 === '1') {
      // Add M to AC
      AC = addBinary(AC, M);
      
      steps.push({
        description: `MQ₀ = 1: Add M to AC`,
        registers: { AC, MQ, M, Count: count.toString(), MQ0: mq0 },
        highlightedRegisters: ['AC', 'MQ'],
        operation: 'add'
      });
    } else {
      steps.push({
        description: `MQ₀ = 0: No addition`,
        registers: { AC, MQ, M, Count: count.toString(), MQ0: mq0 },
        highlightedRegisters: ['MQ'],
        operation: 'shift'
      });
    }
    
    // Shift right AC and MQ (logical shift)
    const combined = AC + MQ;
    const shifted = shiftRight(combined, false);
    AC = shifted.substring(0, bits);
    MQ = shifted.substring(bits);
    
    steps.push({
      description: `Shift right AC and MQ`,
      registers: { AC, MQ, M, Count: count.toString() },
      highlightedRegisters: ['AC', 'MQ'],
      operation: 'shift'
    });
    
    count--;
  }
  
  const product = fromBinary(AC + MQ, false);
  
  steps.push({
    description: `Complete: Product = ${product} (AC:MQ = ${AC}:${MQ})`,
    registers: { AC, MQ, M, Count: '0' },
    highlightedRegisters: ['AC', 'MQ'],
    operation: 'init'
  });
  
  return steps;
};
