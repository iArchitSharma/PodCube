"use client";

import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import Loader from "@/components/Loader";


const HOST_ASSISTANT_ID = process.env.NEXT_PUBLIC_HOST_ASSISTANT_ID;
const GUEST_ASSISTANT_ID = process.env.NEXT_PUBLIC_GUEST_ASSISTANT_ID;

export default function PodcastPlayer({podcastScript}) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [callEnd, setCallEnd] = useState(false);

  const [recording, setRecording] = useState<Recording | null>(null);

  useEffect(() => {
    const fetchRecording = async () => {
      const res = await fetch('/api/get-latest-recording');
      const data = await res.json();
      setRecording(data.recording);
    };

    fetchRecording();
  }, []);

  // FAKE MICROPHONE ACCESS
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      console.log("🔧 Overriding getUserMedia to simulate microphone access...");

      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

      navigator.mediaDevices.getUserMedia = (constraints) => {
        if (constraints.audio) {
          console.log("🎤 Providing a silent fake microphone stream...");

          const ctx = new AudioContext();
          const oscillator = ctx.createOscillator();
          const dst = ctx.createMediaStreamDestination();

          oscillator.connect(dst);
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.01);

          return Promise.resolve(dst.stream);
        }
        return originalGetUserMedia(constraints);
      };
    }
  }, []);


  useEffect(() => {
    const handleCallStart = () => {
      console.log("✅ Call started");
      setIsReady(true);
    };

    const handleSpeechEnd = () => {
      console.log("🛑 Speech finished");
      const nextIndex = currentIndex + 1;
      if (nextIndex < podcastScript.length) {
        setCurrentIndex(nextIndex);
      }
    };

    const handleCallEnd = () => {
      console.log('Call has stopped');
      setCallEnd(true);

    };

    const handleError = (err: Error) => {
      console.error("❌ Error:", err);
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
    };
  }, [currentIndex]);


  useEffect(() => {
    const speak = async () => {
      const current = podcastScript[currentIndex];

      const assistantId =
        current.speaker === "Host" ? HOST_ASSISTANT_ID : GUEST_ASSISTANT_ID;

      console.log(`🎙️ ${current.speaker} says: ${current.text}`);

      await vapi.start(assistantId, {
        recordingEnabled: true,
      });
    };

    speak();
  }, [currentIndex]);

  useEffect(() => {
    if (isReady) {
      const current = podcastScript[currentIndex];
      try {
        if (currentIndex === podcastScript.length - 1) {
          console.log("Finish podcast");
          vapi.say(current.text, true);
        } else {
          vapi.say(current.text);
        }

      } catch (error) {
        console.error("Error saying text:", error);
      }
    }
  }, [isReady, currentIndex]);



  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="bg-dark-800 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6 transition-all duration-500">

        <h1 className="text-3xl font-extrabold mb-6">🎧 AI Podcast Player</h1>

        
        <div className="flex justify-center">
          <Loader /> 
        </div>

        
        <p className="text-lg">
          Now speaking: <strong className="text-primary-400">{podcastScript[currentIndex]?.speaker}</strong>
        </p>

        {callEnd ? (
          <div className="flex justify-center items-center space-x-4 mt-4">
          <p className="text-gray-200 text-lg font-semibold ">
            Your Podcast is Ready
          </p>
          <a href={recording.recordingUrl}>
            <button
              type="submit"
              className="rounded-lg p-3 bg-primary-300 text-primary-foreground shadow-xs hover:bg-primary-300/80 font-medium text-base leading-none flex flex-row items-center justify-center gap-2"
            >
              <span className="font-bold">Download</span>
            </button></a></div>
        ) : (
          <div className="flex justify-center items-center space-x-3 mt-4">
          <p className="text-gray-200 text-lg font-semibold animate-pulse">
            Generating Download Link
          </p>
          <div className="flex space-x-2 dark:invert">
            <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-black rounded-full animate-bounce"></div>
          </div>
        </div>
        )}

      </div>
    </div>



  );
}