'use client'

import { useRouter } from "next/navigation"

import { Button } from "../ui/button"

interface PaginationProps{
    pageNumber: number;
    isNext: boolean;
    path: string;
}

function Pagination({ pageNumber, isNext, path }: PaginationProps) {
    const router = useRouter()

    const handleNavigation = (type: string) => {
        let nextPageNumber = pageNumber
        if(type === 'prev'){
            nextPageNumber = Math.max(1, pageNumber - 1)
        } else {
            nextPageNumber = pageNumber + 1
        }

        if(nextPageNumber > 1) {
            router.push(`/${path}?page=${nextPageNumber}`)
        } else {
            router.push(`/${path}`)
        }
    }

    if(!isNext && pageNumber === 1) return null

    return (
        <div className="mt-10 flex w-full items-center justify-center gap-5">
            <Button
                onClick={() => handleNavigation('prev')}
                disabled={pageNumber === 1}
                className="cursor-pointer text-[14px] bg-[#0095F6] font-normal leading-[140%] text-[#efefef]"
            >
                Prev
            </Button>
            <p className="text-[14px] font-semibold leading-[140%] text-white">{pageNumber}</p>
            <Button
                onClick={() => handleNavigation('next')}
                disabled={!isNext}
                className="cursor-pointer text-[14px] bg-[#0095F6] font-normal leading-[140%] text-[#efefef]"
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination