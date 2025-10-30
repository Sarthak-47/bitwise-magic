// Binary operation utilities for COA algorithms

export const toBinary = (num: number, bits: number = 8): string => {
  if (num >= 0) {
    return num.toString(2).padStart(bits, '0');
  } else {
    // Two's complement for negative numbers
    const positive = Math.abs(num);
    const binary = positive.toString(2);
    const padded = binary.padStart(bits, '0');
    
    // Invert bits
    let inverted = '';
    for (let i = 0; i < padded.length; i++) {
      inverted += padded[i] === '0' ? '1' : '0';
    }
    
    // Add 1
    let result = '';
    let carry = 1;
    for (let i = inverted.length - 1; i >= 0; i--) {
      const bit = parseInt(inverted[i]);
      const sum = bit + carry;
      result = (sum % 2).toString() + result;
      carry = Math.floor(sum / 2);
    }
    
    return result;
  }
};

export const fromBinary = (binary: string, signed: boolean = false): number => {
  if (!signed) {
    return parseInt(binary, 2);
  } else {
    // Check sign bit
    if (binary[0] === '0') {
      return parseInt(binary, 2);
    } else {
      // Negative number in two's complement
      // Invert bits
      let inverted = '';
      for (let i = 0; i < binary.length; i++) {
        inverted += binary[i] === '0' ? '1' : '0';
      }
      
      // Add 1
      let result = '';
      let carry = 1;
      for (let i = inverted.length - 1; i >= 0; i--) {
        const bit = parseInt(inverted[i]);
        const sum = bit + carry;
        result = (sum % 2).toString() + result;
        carry = Math.floor(sum / 2);
      }
      
      return -parseInt(result, 2);
    }
  }
};

export const addBinary = (a: string, b: string): string => {
  let result = '';
  let carry = 0;
  
  for (let i = a.length - 1; i >= 0; i--) {
    const bitA = parseInt(a[i]);
    const bitB = parseInt(b[i]);
    const sum = bitA + bitB + carry;
    result = (sum % 2).toString() + result;
    carry = Math.floor(sum / 2);
  }
  
  return result;
};

export const subtractBinary = (a: string, b: string): string => {
  // Subtract by adding two's complement
  const complement = twosComplement(b);
  return addBinary(a, complement);
};

export const twosComplement = (binary: string): string => {
  // Invert bits
  let inverted = '';
  for (let i = 0; i < binary.length; i++) {
    inverted += binary[i] === '0' ? '1' : '0';
  }
  
  // Add 1
  return addBinary(inverted, '0'.repeat(binary.length - 1) + '1');
};

export const shiftLeft = (binary: string): string => {
  return binary.substring(1) + '0';
};

export const shiftRight = (binary: string, arithmetic: boolean = false): string => {
  if (arithmetic) {
    // Preserve sign bit for arithmetic shift
    return binary[0] + binary.substring(0, binary.length - 1);
  } else {
    // Logical shift - insert 0
    return '0' + binary.substring(0, binary.length - 1);
  }
};

export const isNegative = (binary: string): boolean => {
  return binary[0] === '1';
};
