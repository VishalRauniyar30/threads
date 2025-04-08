import Image from 'next/image'
import Link from 'next/link'
import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

function Topbar() {
    return (
        <nav className='fixed top-0 z-30 flex w-full items-center justify-between px-6 py-3 bg-[#121417]'>
            <Link href='/' className='flex items-center gap-4'>
                <Image 
                    src='/assets/logo.svg'
                    width={28}
                    height={28}
                    alt='logo'
                />
                <p className='text-[24px] font-bold leading-[140%] text-[#ffffff] max-sm:hidden'>
                    Threads
                </p>
            </Link>
            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image 
                                    src='/assets/logout.svg'
                                    width={24}
                                    height={24}
                                    alt='logout'
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: 'py-2 px-4'
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Topbar