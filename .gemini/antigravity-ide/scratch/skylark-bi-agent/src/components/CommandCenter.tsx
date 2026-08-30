'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Terminal, Loader2, BarChart2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EvidencePanel } from './EvidencePanel';

export function CommandCenter() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full max-w-7xl mx-auto rounded-xl overflow-hidden border border-border bg-background shadow-2xl">
      {/* Sidebar - Evidence & Context */}
      <div className="w-1/3 border-r border-border bg-black/40 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/20 rounded-lg">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg tracking-tight">Intelligence Context</h2>
            <p className="text-xs text-muted-foreground">Live Data Evidence</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <EvidencePanel messages={messages} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background relative">
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 z-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80">
              <Terminal className="w-12 h-12 mb-2 text-primary" />
              <div>
                <h3 className="text-2xl font-medium tracking-wide">Awaiting Command</h3>
                <p className="text-sm max-w-sm mt-2 text-muted-foreground">
                  Ask about pipeline value, sector performance, top opportunities, or work order billing status.
                </p>
              </div>
              <button 
                onClick={() => {
                  handleInputChange({ target: { value: 'Please generate a leadership briefing update.' } } as any);
                  setTimeout(() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
                }}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-full px-6 py-2 text-sm transition-all"
              >
                Prepare Leadership Update
              </button>
            </div>
          )}
          
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-5 ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border border-border/50 text-foreground shadow-sm'
              }`}>
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 opacity-70">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Skylark Agent</span>
                  </div>
                )}
                <div className="prose prose-invert max-w-none text-sm leading-relaxed prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-border">
                  {m.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                  
                  {/* Handle tool calls visually in the main chat (optional) */}
                  {m.toolInvocations?.map((tool, i) => (
                    <div key={i} className="mt-4 p-3 bg-black/40 rounded border border-border/50 text-xs font-mono text-muted-foreground flex items-center gap-2">
                      <Loader2 className={`w-3 h-3 ${!('result' in tool) ? 'animate-spin' : ''}`} />
                      Executing: {tool.toolName}...
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-background border-t border-border/50 z-20">
          <form onSubmit={handleSubmit} className="relative group">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Query the intelligence agent..."
              className="w-full bg-muted border border-border rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !(input || '').trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
