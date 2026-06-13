import React from "react";
import AmbientBackground from "@/components/AmbientBackground";
import IntroLetter from "@/components/IntroLetter";
import Timeline from "@/components/Timeline";
import ForgivenessSection from "@/components/ForgivenessSection";
import { getForgivenessState } from "./actions";

export default async function Home() {
  const state = await getForgivenessState();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start">
      {/* Cinematic Ambient Background (Particles + Grain) */}
      <AmbientBackground />

      <main className="w-full flex flex-col items-stretch z-10">
        {/* Step 1: Cinematic Intro Letter */}
        <IntroLetter />

        {/* Step 2: Scrapbook / Timeline */}
        <Timeline />

        {/* Step 3: Climax Forgiveness Form */}
        <ForgivenessSection initialForgiven={state.isForgiven} />
      </main>
    </div>
  );
}
