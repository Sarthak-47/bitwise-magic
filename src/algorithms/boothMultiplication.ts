import { Step } from '@/types/algorithm';
import { toBinary, addBinary, subtractBinary, shiftRight, fromBinary } from '@/utils/binaryOperations';

export const boothMultiplication = (multiplicand: number, multiplier: number, bits: number = 8): Step[] => {
  const steps: Step[] = [];
  
  // Initialize registers
  let AC = '0'.repeat(bits); // Accumulator
  let MQ = toBinary(multiplier, bits); // Multiplier (signed)
  let M = toBinary(multiplicand, bits); // Multiplicand (signed)
  let Q_1 = '0'; // Previous LSB
  let count = bits;
  
  steps.push({
    description: `Initialize: AC = 0, MQ = ${multiplier}, M = ${multiplicand}, Q₋₁ = 0, Count = ${bits}`,
    registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString() },
    highlightedRegisters: ['AC', 'MQ', 'M'],
    operation: 'init'
  });
  
  while (count > 0) {
    // Get MQ₀ and Q₋₁
    const mq0 = MQ[bits - 1];
    const bitPair = mq0 + Q_1;
    
    if (bitPair === '10') {
      // Subtract M from AC
      AC = subtractBinary(AC, M);
      
      steps.push({
        description: `(MQ₀, Q₋₁) = (1,0): Subtract M from AC`,
        registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString(), 'Bit Pair': bitPair },
        highlightedRegisters: ['AC'],
        operation: 'subtract'
      });
    } else if (bitPair === '01') {
      // Add M to AC
      AC = addBinary(AC, M);
      
      steps.push({
        description: `(MQ₀, Q₋₁) = (0,1): Add M to AC`,
        registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString(), 'Bit Pair': bitPair },
        highlightedRegisters: ['AC'],
        operation: 'add'
      });
    } else {
      steps.push({
        description: `(MQ₀, Q₋₁) = (${bitPair}): No operation`,
        registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString(), 'Bit Pair': bitPair },
        highlightedRegisters: ['MQ'],
        operation: 'booth'
      });
    }
    
    // Arithmetic shift right AC, MQ, Q₋₁
    Q_1 = MQ[bits - 1];
    const combined = AC + MQ;
    const shifted = shiftRight(combined, true); // Arithmetic shift
    AC = shifted.substring(0, bits);
    MQ = shifted.substring(bits);
    
    steps.push({
      description: `Arithmetic shift right AC, MQ, Q₋₁`,
      registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: count.toString() },
      highlightedRegisters: ['AC', 'MQ', 'Q₋₁'],
      operation: 'shift'
    });
    
    count--;
  }
  
  const product = fromBinary(AC + MQ, true);
  
  steps.push({
    description: `Complete: Product = ${product} (AC:MQ = ${AC}:${MQ})`,
    registers: { AC, MQ, M, 'Q₋₁': Q_1, Count: '0' },
    highlightedRegisters: ['AC', 'MQ'],
    operation: 'init'
  });
  
  return steps;
};
