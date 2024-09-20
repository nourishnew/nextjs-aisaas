"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import TypeWriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
export const LandingHero = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        <h1>The best AI tool for </h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pnk-600">
          <TypeWriterComponent
            options={{
              strings: [
                "Chatbot",
                "Photo generation",
                "Music generation",
                "code generation",
                "Video generation",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Create content using AI 10x faster
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="premium">Start generating for free</Button>
        </Link>
      </div>
    </div>
  );
};
