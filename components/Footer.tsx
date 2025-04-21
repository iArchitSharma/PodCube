import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 mt-25 sm:mt-0">
  <div className="border-t border-slate-900/5 py-10">
  <Image className="mx-auto h-20 w-auto text-slate-900" src="./logo.svg" width={60} height={32} alt='PodCube logo' />
    <p className="mt-5 text-center text-sm leading-6 text-slate-500">
      © 2025 PodCube. All rights reserved.
    </p>
    <div className="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700">
    <Link href="/privacy-policy">Privacy policy</Link>
      <div className="h-4 w-px bg-slate-500/20" />
      <Link href="/changelog">Changelog</Link>
    </div>
  </div>
</footer>

  )
}

export default Footer