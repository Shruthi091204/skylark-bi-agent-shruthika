import { Message } from 'ai';
import { Database, CheckCircle2 } from 'lucide-react';

export function EvidencePanel({ messages }: { messages: Message[] }) {
  // Extract all tool invocations from messages
  const toolInvocations = messages.flatMap(m => m.toolInvocations || []);

  if (toolInvocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/50 border border-dashed border-border rounded-lg">
        <Database className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm">No data queried yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {toolInvocations.map((tool, idx) => {
        const isComplete = 'result' in tool;
        
        return (
          <div key={idx} className="bg-black/50 border border-border/50 rounded-lg p-4 transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 mb-3">
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              <h3 className="text-sm font-medium font-mono text-primary/90 truncate">
                {tool.toolName}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Parameters</p>
                <pre className="text-xs bg-black/60 p-2 rounded text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(tool.args, null, 2)}
                </pre>
              </div>

              {isComplete && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Result Data</p>
                  <pre className="text-[11px] leading-tight bg-black/80 p-2 rounded text-zinc-400 overflow-x-auto max-h-48 custom-scrollbar">
                    {JSON.stringify(tool.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
