import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { getHistory, clearHistory } from '@/lib/db';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface HistoryEntry {
  id: number;
  calculation: string;
  result: string;
  category: string;
  createdAt: string;
}

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getHistory();
    setHistory(data as HistoryEntry[]);
  };

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Calculation History</span>
          <Button variant="destructive" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">No history yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{entry.calculation}</p>
                    <p className="text-lg font-bold text-primary">= {entry.result}</p>
                    <p className="text-sm text-muted-foreground">Category: {entry.category}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}