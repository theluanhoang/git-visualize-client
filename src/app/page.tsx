'use client';

import BottomCTA from "@/components/common/home/BottomCTA";
import Features from "@/components/common/home/Features";
import Hero from "@/components/common/home/Hero";
import SystemOverview from "@/components/common/home/SystemOverview";
export default function Home() {
  return (
    <div className="">
      <Hero />
      <main className="container mx-auto mt-10 px-4">
        <SystemOverview />
        <Features />
        <BottomCTA /> 
      </main>
    </div>
  );
}
