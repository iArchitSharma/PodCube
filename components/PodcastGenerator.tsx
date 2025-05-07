'use client'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Combobox } from './Combobox'
import { useRouter } from 'next/navigation';

const PodcastGenerator = ({user}) => {
  const router = useRouter();
  const [tone, setTone] = useState("Casual");
  const [url, setUrl] = useState("");

  const [responseId, setResponseId] = useState<string | null>(null);

  const styles = [
    {
      value: "Casual",
      label: "Casual",
    },
    {
      value: "Professional",
      label: "Professional",
    },
    {
      value: "Funny",
      label: "Funny",
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
    console.log("Form submitted with:", { url, tone })

    const response = await fetch('/api/vapi/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        tone,
        userid: await user.uid
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      setResponseId(data.id);
    } else {
      console.error('Response failed:', data.error);
    }
    
  } catch (error) {
    console.error("Error submitting form:", error);
  }
  }

  useEffect(() => {
    if (responseId) {
      console.log("Updated responseId:", responseId);
      router.push(`/podcast/play?id=${responseId}`);

    }
  }, [responseId]);

  return (
    <div className='relative z-10 container mx-auto px-4 text-center'>
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
        style={{ lineHeight: 1.2 }} >
        AI Podcast Generator
      </h2>
      <div className="mt-10 p-10">
        <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-2 max-w-lg">
          <fieldset className="contents">
            <div className="flex flex-col">
              <input
                type="url"
                name="input"
                id="input"
                value={url}
                onChange={ (e) => setUrl(e.target.value) }
                required
                placeholder="🔗 Paste a link here to generate your podcast"
                className={cn(
                  "w-full rounded-lg p-4 font-medium text-sm",
                  "border border-input bg-transparent shadow-xs transition-colors",
                  "focus:ring-[1.5px] focus:ring-primary focus:border-ring",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "disabled:opacity-50"
                )}
              />
            </div>
            <Combobox
              options={styles}
              value={tone}
              onChange={setTone}
              placeholder="Select a style"
            />
            <button
              type="submit"
              className="rounded-lg p-3 bg-primary-300 text-primary-foreground shadow-xs hover:bg-primary-300/90 font-medium text-base leading-none flex flex-row items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold">Generate podcast now!</span>
            </button>
          </fieldset>
        </form>
      </div></div>

  )
}

export default PodcastGenerator