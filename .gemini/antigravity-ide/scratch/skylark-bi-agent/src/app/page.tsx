import { CommandCenter } from '@/components/CommandCenter';
import { ConnectionStatus } from '@/components/ConnectionStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-foreground p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <header className="mb-8 flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            SKYLARK // EXECUTIVE INTELLIGENCE
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            Business Intelligence Command Center
          </p>
        </div>
        <ConnectionStatus />
      </header>

      <CommandCenter />
    </main>
  );
}
