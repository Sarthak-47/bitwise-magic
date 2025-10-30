import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface OutputPanelProps {
  result?: {
    binary: string;
    decimal: number;
    quotient?: number;
    remainder?: number;
  };
}

const OutputPanel = ({ result }: OutputPanelProps) => {
  const handleExport = () => {
    if (!result) return;

    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coa-result.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Result exported successfully!');
  };

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Output</h2>
        {result && (
          <Button
            onClick={handleExport}
            variant="secondary"
            size="sm"
            className="bg-secondary hover:bg-secondary/80"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {result ? (
        <div className="space-y-4">
          {result.quotient !== undefined && result.remainder !== undefined ? (
            <>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Quotient</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {result.quotient}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Remainder</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {result.remainder}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Decimal</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {result.decimal}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Binary</p>
                <p className="text-lg font-mono text-foreground break-all">
                  {result.binary}
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Run a simulation to see results</p>
        </div>
      )}
    </Card>
  );
};

export default OutputPanel;
