import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const ControlPanel = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  disabled = false
}: ControlPanelProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Controls</h2>
      
      <div className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={onStepBack}
            disabled={disabled || currentStep === 0}
            variant="secondary"
            size="icon"
            className="bg-secondary hover:bg-secondary/80"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {isPlaying ? (
            <Button
              onClick={onPause}
              disabled={disabled}
              className="bg-primary hover:bg-primary/90"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onPlay}
              disabled={disabled || currentStep >= totalSteps}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
          )}

          <Button
            onClick={onStepForward}
            disabled={disabled || currentStep >= totalSteps}
            variant="secondary"
            size="icon"
            className="bg-secondary hover:bg-secondary/80"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            onClick={onReset}
            disabled={disabled}
            variant="secondary"
            size="icon"
            className="bg-secondary hover:bg-secondary/80"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Speed</span>
            <span>{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={0.5}
            max={2}
            step={0.25}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;
