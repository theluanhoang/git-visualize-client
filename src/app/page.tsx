'use client';

import BottomCTA from "@/components/home/BottomCTA";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import SystemOverview from "@/components/home/SystemOverview";


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
