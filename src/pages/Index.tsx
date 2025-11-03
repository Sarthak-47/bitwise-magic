import { useState, useEffect } from 'react';
import { AlgorithmType, AlgorithmInfo, SimulationState } from '@/types/algorithm';
import { Step } from '@/types/algorithm';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import InputPanel from '@/components/InputPanel';
import RegisterVisualizer from '@/components/RegisterVisualizer';
import TypewriterNarration from '@/components/TypewriterNarration';
import ControlPanel from '@/components/ControlPanel';
import OutputPanel from '@/components/OutputPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { restoringDivision } from '@/algorithms/restoringDivision';
import { nonRestoringDivision } from '@/algorithms/nonRestoringDivision';
import { shiftAddMultiplication } from '@/algorithms/shiftAddMultiplication';
import { boothMultiplication } from '@/algorithms/boothMultiplication';
import { fastBoothMultiplication } from '@/algorithms/fastBoothMultiplication';
import { toast } from 'sonner';
import { fromBinary } from '@/utils/binaryOperations';

const algorithms: AlgorithmInfo[] = [
  {
    id: 'restoring-division',
    name: 'Restoring Division',
    description: 'Classic division algorithm that restores the accumulator when the result is negative after subtraction.',
    inputLabels: { operand1: 'Dividend', operand2: 'Divisor' }
  },
  {
    id: 'non-restoring-division',
    name: 'Non-Restoring Division',
    description: 'Optimized division that avoids restoration by alternating between addition and subtraction based on AC sign.',
    inputLabels: { operand1: 'Dividend', operand2: 'Divisor' }
  },
  {
    id: 'shift-add-multiplication',
    name: 'Unsigned Multiplication (Shift-and-Add)',
    description: 'Basic multiplication algorithm that adds the multiplicand when the multiplier bit is 1, then shifts right.',
    inputLabels: { operand1: 'Multiplicand', operand2: 'Multiplier' }
  },
  {
    id: 'booth-multiplication',
    name: "Booth's Algorithm (Signed)",
    description: "Signed multiplication using bit pairs (MQ₀, Q₋₁) to determine add/subtract operations, handles negative numbers.",
    inputLabels: { operand1: 'Multiplicand', operand2: 'Multiplier' }
  },
  {
    id: 'fast-booth-multiplication',
    name: 'Fast Booth Recoding',
    description: 'Optimized Booth multiplier using 2-bit grouping (radix-4) to reduce the number of operations by ~50%.',
    inputLabels: { operand1: 'Multiplicand', operand2: 'Multiplier' }
  }
];

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('restoring-division');
  const [bitSize, setBitSize] = useState(8);
  const [simulation, setSimulation] = useState<SimulationState>({
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 1
  });
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);

  const isDivisionAlgorithm = selectedAlgorithm.includes('division');
  const currentAlgo = algorithms.find(a => a.id === selectedAlgorithm)!;

  useEffect(() => {
    if (simulation.isPlaying && canAdvance && simulation.currentStep < simulation.steps.length - 1) {
      setCanAdvance(false);
      setTimeout(() => {
        setSimulation(prev => {
          if (prev.currentStep >= prev.steps.length - 1) {
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentStep: prev.currentStep + 1 };
        });
      }, 500); // Small delay after typing completes before advancing
    }
  }, [simulation.isPlaying, canAdvance, simulation.currentStep, simulation.steps.length]);

  const handleTypingComplete = () => {
    setCanAdvance(true);
  };

  const runAlgorithm = (operand1: number, operand2: number, bits: number) => {
    try {
      let steps: Step[] = [];

      switch (selectedAlgorithm) {
        case 'restoring-division':
          steps = restoringDivision(operand1, operand2, bits);
          break;
        case 'non-restoring-division':
          steps = nonRestoringDivision(operand1, operand2, bits);
          break;
        case 'shift-add-multiplication':
          steps = shiftAddMultiplication(operand1, operand2, bits);
          break;
        case 'booth-multiplication':
          steps = boothMultiplication(operand1, operand2, bits);
          break;
        case 'fast-booth-multiplication':
          steps = fastBoothMultiplication(operand1, operand2, bits);
          break;
      }

      // Extract result from last step
      const lastStep = steps[steps.length - 1];
      let result;

      if (isDivisionAlgorithm) {
        result = {
          binary: lastStep.registers.QR + ':' + lastStep.registers.AC,
          decimal: 0,
          quotient: fromBinary(lastStep.registers.QR, false),
          remainder: fromBinary(lastStep.registers.AC, false)
        };
      } else {
        const productBinary = lastStep.registers.AC + lastStep.registers.MQ;
        result = {
          binary: productBinary,
          decimal: fromBinary(productBinary, selectedAlgorithm.includes('booth'))
        };
      }

      setSimulation({
        steps,
        currentStep: 0,
        isPlaying: false,
        speed: 1,
        result
      });

      toast.success('Simulation initialized! Press Play to begin.');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleReset = () => {
    setSimulation({
      steps: [],
      currentStep: 0,
      isPlaying: false,
      speed: 1
    });
  };

  const handlePlay = () => {
    setCanAdvance(false);
    setSimulation(prev => ({ ...prev, isPlaying: true }));
  };

  const handlePause = () => {
    setSimulation(prev => ({ ...prev, isPlaying: false }));
  };

  const handleStepForward = () => {
    setCanAdvance(false);
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
    }));
  };

  const handleStepBack = () => {
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const handleSpeedChange = (speed: number) => {
    setSimulation(prev => ({ ...prev, speed }));
  };

  const currentStep = simulation.steps[simulation.currentStep];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            COA Algorithm Visualizer
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive visualization of Computer Organization & Architecture arithmetic algorithms
          </p>
        </div>

        {/* Algorithm Selector */}
        <AlgorithmSelector
          selected={selectedAlgorithm}
          onSelect={(algo) => {
            setSelectedAlgorithm(algo);
            handleReset();
          }}
          algorithms={algorithms}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Input & Controls */}
          <div className="space-y-6">
            <InputPanel
              onStart={runAlgorithm}
              onReset={handleReset}
              inputLabels={currentAlgo.inputLabels}
              isDivision={isDivisionAlgorithm}
              bitSize={bitSize}
              onBitSizeChange={setBitSize}
            />
            <ControlPanel
              isPlaying={simulation.isPlaying}
              currentStep={simulation.currentStep}
              totalSteps={simulation.steps.length}
              speed={simulation.speed}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepBack={handleStepBack}
              onStepForward={handleStepForward}
              onReset={handleReset}
              onSpeedChange={handleSpeedChange}
              disabled={simulation.steps.length === 0}
            />
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-3 space-y-6">
            {currentStep ? (
              <>
                <RegisterVisualizer
                  registers={currentStep.registers}
                  highlightedRegisters={currentStep.highlightedRegisters}
                  operation={currentStep.operation}
                />
                <TypewriterNarration
                  text={currentStep.description}
                  speed={simulation.speed}
                  onComplete={handleTypingComplete}
                />
                <OutputPanel result={simulation.result} />
              </>
            ) : (
              <Card className="p-12 border-border bg-card text-center">
                <p className="text-muted-foreground text-lg">
                  Enter values and click Start to begin the simulation
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
