export type OperationType = 'add' | 'subtract' | 'shift' | 'booth' | 'init' | 'restore';

export interface Step {
  description: string;
  registers: {
    [key: string]: string; // Register name -> binary value
  };
  highlightedRegisters?: string[];
  operation?: OperationType;
}

export interface SimulationState {
  steps: Step[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // 0.5x to 2x
  result?: {
    binary: string;
    decimal: number;
    quotient?: number;
    remainder?: number;
  };
}

export type AlgorithmType = 
  | 'restoring-division'
  | 'non-restoring-division'
  | 'shift-add-multiplication'
  | 'booth-multiplication'
  | 'fast-booth-multiplication';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  inputLabels: {
    operand1: string;
    operand2: string;
  };
}
