import { CommandCenter } from '@/components/CommandCenter';
import { ConnectionStatus } from '@/components/ConnectionStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <header className="mb-8 flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="bg-white/5 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
            {/* Using standard img to avoid next/image domain config issues since it's an external URL */}
            <img 
              src="https://cdn.prod.website-files.com/5d490ccd3cf49e0bd0ec972e/5d9f242549b5406b6852e112_skylark-drones-logo.png" 
              alt="Skylark Drones" 
              className="h-8 object-contain brightness-0 invert" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent font-[family-name:var(--font-raleway)]">
              EXECUTIVE INTELLIGENCE
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-wide uppercase font-medium">
              Business Intelligence Command Center
            </p>
          </div>
        </div>
        <ConnectionStatus />
      </header>

      <CommandCenter />
    </main>
  );
}
