import { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { Bottombar, LeftSidebar, RightSidebar, Topbar } from "@/components/shared"
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Threads',
    description: ' a real-time social media platform for text-based discussions, allowing users to post, reply, and engage in conversations'
}


export default function RootLayout({ 
    children 
}: { 
    children: ReactNode 
}) {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <html lang="en" suppressHydrationWarning>
                <body className={inter.className}>
                    <Topbar />
                    <main className="flex flex-row">
                        <LeftSidebar />
                        <section className="flex min-h-screen flex-1 flex-col items-center bg-[#000000] text-white px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
                            <div className="w-full max-w-4xl">
                                {children}
                            </div>
                        </section>
                        <RightSidebar />
                    </main>
                    <Bottombar />
                </body>
            </html>
        </ClerkProvider>
    )
}