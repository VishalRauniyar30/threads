'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs"

import { sidebarLinks } from "@/constants"

function LeftSidebar () {
    const pathname = usePathname()

    const { userId } = useAuth()
    
    const updatedSidebar = sidebarLinks.map((link) => ({
        ...link,
        route: link.dynamic && userId ? `/profile/${userId}` : link.route
    })).filter(link => !(link.dynamic && !userId)) 

    return (
        <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-[#1F1F22] bg-[#121417] pb-5 pt-28 max-md:hidden">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {updatedSidebar.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
                    return (
                        <Link 
                            href={link.route} 
                            key={link.label} 
                            className={`${isActive  && 'bg-[#877EFF]'} relative flex justify-start gap-4 rounded-lg p-4`}
                        >
                            <Image 
                                src={link.imgURL} 
                                alt={link.label} 
                                width={24} 
                                height={24} 
                            />
                            <p className='text-[#ffffff] max-lg:hidden'>
                                {link.label}
                            </p>
                        </Link>
                    )}
                )}
            </div>

            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image 
                                src='/assets/logout.svg'
                                alt="logout"
                                width={24}
                                height={24}
                            />
                            <p className="text-[#EFEFEF] max-lg:hidden">
                                Logout
                            </p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar