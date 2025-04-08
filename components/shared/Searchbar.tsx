'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input"

interface SearchbarProps{
    routeType: string
}

function Searchbar({ routeType }: SearchbarProps) {
    const router = useRouter()
    const [search, setSearch] = useState("")

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(search) {
                router.push(`${routeType}?q=` + search)
            } else {
                router.push(`${routeType}`)
            }
        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [search, routeType])

    return (
        <div className="flex gap-1 rounded-lg bg-[#101012] px-4 py-2">
            <Image 
                src='/assets/search-gray.svg'
                alt="search"
                width={24}
                height={24}
                className="object-contain"
            />
            <Input
                id="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${routeType === '/search' ? 'Search Creators' : "Search Communities"}`}
                className="no-focus border-none bg-[#101012] text-base font-normal leading-[140%] text-[#5C5C7B] outline-none"
            />
        </div>
    )
}

export default Searchbar