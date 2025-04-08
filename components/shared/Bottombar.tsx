'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { sidebarLinks } from '@/constants'
import { useAuth } from '@clerk/nextjs'

function Bottombar() {
    const pathname = usePathname()

    const { userId } = useAuth()

    const updatedSidebar = sidebarLinks.map((link) => ({
        ...link,
        route: link.dynamic && userId ? `/profile/${userId}` : link.route
    })).filter(link => !(link.dynamic && !userId)) 

    return (
        <section className='fixed bottom-0 z-10 w-full rounded-t-3xl p-4 backdrop-blur-lg sm:px-7 bg-[rgba(16,16,18,0.6)] md:hidden'>
            <div className='flex items-center justify-between gap-3 sm:gap-5'>
                {updatedSidebar.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
                    return (
                        <Link 
                            href={link.route} 
                            key={link.label} 
                            className={`${isActive  && 'bg-[#877EFF]'} relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
                        >
                            <Image 
                                src={link.imgURL} 
                                alt={link.label} 
                                width={16} 
                                height={16} 
                                className='object-contain' 
                            />
                            <p className='text-[#ffffff] max-sm:hidden text-[12px] font-medium leading-[16px]'>
                                {link.label.split(/\s+/)[0]}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar