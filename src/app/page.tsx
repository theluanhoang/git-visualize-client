'use client';

import CommitGraph from "@/components/CommitGraph";
import Header from "@/components/Header";
import Terminal from "@/components/terminal/Terminal";
import TerminalWrapper from "@/components/terminal/TerminalWrapper";
import { TerminalIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="mt-10 container mx-auto">
        <div className="flex flex-col gap-4">
          {/* Interactive Commit Graph */}
          <CommitGraph />
          {/* Terminal Component */}
          <TerminalWrapper />
        </div>
      </main>
      <footer className="">

      </footer>
    </div>
  );
}
