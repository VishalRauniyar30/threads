import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { CommunityCard } from "@/components/cards"
import { Pagination, Searchbar } from "@/components/shared"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchUser } from "@/lib/actions/user.actions"

async function Communities ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const user = await currentUser()
        if(!user) { 
            return null
        }
    
        const userInfo = await fetchUser(user.id)
    
        if(!userInfo?.onboarded) {
            redirect('/onboarding')
        }
    
        const allCommunities = await fetchCommunities({
            searchString: searchParams.q,
            pageNumber: searchParams?.page ? +searchParams.page : 1,
            pageSize: 25
        })
    return (
        <>
            <h1 className="text-[30px] font-bold leading-[140%] text-white">
                Communities
            </h1>
            <div className="mt-5">
                <Searchbar routeType="/communities" />
            </div>
            <section className="mt-9 flex flex-wrap gap-4">
                {allCommunities?.communities?.length === 0 ? (
                    <p className="text-center text-base font-normal leading-[140%] text-[#7878A3]">No Result</p>
                ) : (
                    <>
                        {allCommunities.communities.map((community) => (
                            <CommunityCard
                            />
                        ))}
                    </>
                )}
            </section>
            <Pagination 
                path="communities"
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={allCommunities.isNext}
            />
        </>
    )
}

export default Communities