import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { gsap } from 'gsap';
import { OperationType } from '@/types/algorithm';

interface RegisterVisualizerProps {
  registers: { [key: string]: string };
  highlightedRegisters?: string[];
  operation?: OperationType;
}

const getOperationColor = (operation?: OperationType) => {
  switch (operation) {
    case 'add':
      return 'operation-add';
    case 'subtract':
      return 'operation-subtract';
    case 'shift':
      return 'operation-shift';
    case 'booth':
      return 'operation-booth';
    case 'restore':
      return 'operation-booth';
    default:
      return 'primary';
  }
};

const RegisterVisualizer = ({ registers, highlightedRegisters = [], operation }: RegisterVisualizerProps) => {
  const registerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const bitRefs = useRef<{ [key: string]: (HTMLSpanElement | null)[] }>({});

  useEffect(() => {
    // Animate highlighted registers
    highlightedRegisters.forEach((regName) => {
      const regElement = registerRefs.current[regName];
      if (regElement) {
        gsap.fromTo(
          regElement,
          { scale: 1, boxShadow: '0 0 0px rgba(0,0,0,0)' },
          {
            scale: 1.02,
            boxShadow: `0 0 20px hsl(var(--glow-${getOperationColor(operation).replace('operation-', '')}) / 0.5)`,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          }
        );

        // Animate individual bits
        const bits = bitRefs.current[regName];
        if (bits) {
          bits.forEach((bit, index) => {
            if (bit) {
              gsap.fromTo(
                bit,
                { scale: 1 },
                {
                  scale: 1.1,
                  duration: 0.2,
                  delay: index * 0.02,
                  yoyo: true,
                  repeat: 1
                }
              );
            }
          });
        }
      }
    });
  }, [registers, highlightedRegisters, operation]);

  const renderRegister = (name: string, value: string) => {
    const isHighlighted = highlightedRegisters.includes(name);
    const isBinary = /^[01]+$/.test(value);
    
    if (!bitRefs.current[name]) {
      bitRefs.current[name] = [];
    }

    return (
      <div
        key={name}
        ref={(el) => (registerRefs.current[name] = el)}
        className={`p-4 rounded-lg border transition-all ${
          isHighlighted 
            ? `border-${getOperationColor(operation)} bg-${getOperationColor(operation)}/5` 
            : 'border-border bg-register-bg'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-primary">{name}</span>
          {!isBinary && (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        </div>
        
        {isBinary ? (
          <div className="flex gap-1 flex-wrap font-mono">
            {value.split('').map((bit, index) => (
              <span
                key={index}
                ref={(el) => (bitRefs.current[name][index] = el)}
                className={`px-2 py-1 rounded text-sm ${
                  bit === '1' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg font-mono text-foreground">
            {value}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Registers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(registers).map(([name, value]) => renderRegister(name, value))}
      </div>
    </Card>
  );
};

export default RegisterVisualizer;
