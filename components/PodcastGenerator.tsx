import React from 'react'
import { cn } from "@/lib/utils"

const PodcastGenerator = () => {
  return (
    <div className='relative z-10 container mx-auto px-4 text-center'>
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
          style={{ lineHeight: 1.2 }} >
          AI Podcast Generator
        </h2>
    <div className="mt-10 p-10">
  <form className="flex flex-col mx-auto gap-2 max-w-lg">
    <fieldset className="contents">
      <div className="flex flex-col">
        {/* <label htmlFor="input" className="font-semibold text-lg">
          Enter product description
        </label> */}
        <textarea
          name="input"
          id="input"
          rows="5"
          maxLength="256"
          required
          placeholder="Eg. A new and innovative water bottle that keeps drinks cold for 24 hours. [Max 256 chars]"
          className={cn(
            "rounded-lg p-4 font-mono font-medium text-sm input",
            "focus-visible:border-ring focus-visible:ring-primary-500 focus-visible:ring-[1.5px]",
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          )}
        ></textarea>
      </div>
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