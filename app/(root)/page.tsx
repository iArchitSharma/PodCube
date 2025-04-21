import Features from '@/components/Features'
import Footer from '@/components/Footer'
import Home from '@/components/Hero'
import React from 'react'

const page = () => {
  return (
    <>
    {/* <section className='card-cta'>
      <div className='flex flex-col gap-6 max-w-lg'>
        <h2>Generate your Podcast with the AI-Powered PodCube</h2>
      </div>
    </section> */}
    <Home />
    <Features />
    <Footer />
    </>
  )
}

export default page