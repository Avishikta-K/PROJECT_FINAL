import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link href={'/'} className='flex items-center gap-2'>
        <Image src={'/logo.png'} alt='logo'
        width={40} height={40} />
        {/* <h2 className='font-bold text-xl'>Fusion Desk</h2> */}
    </Link>
  )
}

export default Logo