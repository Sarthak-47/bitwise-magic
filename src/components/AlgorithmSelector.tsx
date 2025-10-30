import { AlgorithmType, AlgorithmInfo } from '@/types/algorithm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
  algorithms: AlgorithmInfo[];
}

const AlgorithmSelector = ({ selected, onSelect, algorithms }: AlgorithmSelectorProps) => {
  const selectedAlgo = algorithms.find(a => a.id === selected);
  
  return (
    <Card className="p-6 border-border bg-card">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Algorithm
          </label>
          <Select value={selected} onValueChange={(value) => onSelect(value as AlgorithmType)}>
            <SelectTrigger className="w-full bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {algorithms.map((algo) => (
                <SelectItem key={algo.id} value={algo.id} className="hover:bg-secondary">
                  {algo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedAlgo && (
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-2">{selectedAlgo.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedAlgo.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlgorithmSelector;
