import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { CommunityCard } from "@/components/cards"
import { Pagination, Searchbar } from "@/components/shared"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchUser } from "@/lib/actions/user.actions"

async function Communities({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resSearchParams = await searchParams
    const user = await currentUser()
    if(!user) { 
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) {
        redirect('/onboarding')
    }
    
    const allCommunities = await fetchCommunities({
        searchString: resSearchParams.q,
        pageNumber: resSearchParams?.page ? +resSearchParams.page : 1,
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
            <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {allCommunities?.communities?.length === 0 ? (
                    <p className="text-center text-base font-normal leading-[140%] text-[#7878A3]">No Result</p>
                ) : (
                    <>
                        {allCommunities.communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                bio={community.bio}
                                imgUrl={community.image}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </section>
            <Pagination 
                path="communities"
                pageNumber={resSearchParams?.page ? +resSearchParams.page : 1}
                isNext={allCommunities.isNext}
            />
        </>
    )
}

export default Communities