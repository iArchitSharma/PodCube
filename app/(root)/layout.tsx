import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

const Layout = async ({children} : {children : ReactNode}) => {

  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className="flex items-center gap-2">
        <Image src="./logo.svg" width={60} height={32} alt='PodCube logo' />
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default Layout