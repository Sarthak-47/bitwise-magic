import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

interface InputPanelProps {
  onStart: (operand1: number, operand2: number, bits: number) => void;
  onReset: () => void;
  inputLabels: {
    operand1: string;
    operand2: string;
  };
  isDivision?: boolean;
  bitSize: number;
  onBitSizeChange: (bits: number) => void;
}

const InputPanel = ({ onStart, onReset, inputLabels, isDivision = false, bitSize, onBitSizeChange }: InputPanelProps) => {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');

  const handleStart = () => {
    const num1 = parseInt(operand1);
    const num2 = parseInt(operand2);

    if (isNaN(num1) || isNaN(num2)) {
      toast.error('Please enter valid numbers');
      return;
    }

    if (isDivision && num2 === 0) {
      toast.error('Divisor cannot be zero!');
      return;
    }

    const maxVal = Math.pow(2, bitSize - 1) - 1;
    if (Math.abs(num1) > maxVal || Math.abs(num2) > maxVal) {
      toast.error(`Numbers must be between -${maxVal} and ${maxVal} for ${bitSize}-bit operations`);
      return;
    }

    onStart(num1, num2, bitSize);
  };

  const handleRandom = () => {
    const max = isDivision ? 100 : 15;
    const min = isDivision ? 10 : -15;
    
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (isDivision && num2 === 0) num2 = 1;
    
    setOperand1(num1.toString());
    setOperand2(num2.toString());
    
    toast.success('Random values generated!');
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Input</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Bit Size
          </label>
          <div className="flex gap-2">
            {[4, 8, 16].map((bits) => (
              <Button
                key={bits}
                onClick={() => onBitSizeChange(bits)}
                variant={bitSize === bits ? "default" : "secondary"}
                className={bitSize === bits ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"}
                size="sm"
              >
                {bits}-bit
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {inputLabels.operand1}
          </label>
          <Input
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="Enter number"
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {inputLabels.operand2}
          </label>
          <Input
            type="number"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Enter number"
            className="bg-secondary border-border"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleStart} 
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
          <Button 
            onClick={handleRandom} 
            variant="secondary"
            className="bg-secondary hover:bg-secondary/80"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            onClick={onReset} 
            variant="secondary"
            className="bg-secondary hover:bg-secondary/80"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InputPanel;
