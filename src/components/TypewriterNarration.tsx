import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import Typed from 'typed.js';

interface TypewriterNarrationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterNarration = ({ text, speed = 1, onComplete }: TypewriterNarrationProps) => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!typedRef.current) return;

    // Destroy previous instance
    if (typedInstance.current) {
      typedInstance.current.destroy();
    }

    setIsTyping(true);

    // Create new typed instance
    typedInstance.current = new Typed(typedRef.current, {
      strings: [text],
      typeSpeed: Math.max(10, 50 / speed),
      showCursor: true,
      cursorChar: '|',
      onComplete: () => {
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    });

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [text, speed, onComplete]);

  return (
    <Card className="p-6 border-border bg-card min-h-[100px] flex items-center">
      <div className="w-full">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Current Step</h3>
        <p className="text-base leading-relaxed text-foreground font-mono">
          <span ref={typedRef}></span>
        </p>
      </div>
    </Card>
  );
};

export default TypewriterNarration;
