import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { UserCard } from "@/components/cards"
import { Pagination, Searchbar } from "@/components/shared"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"

async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const resSearchParams = await searchParams
    console.log(resSearchParams)
    
    const user = await currentUser()
    if(!user) { 
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) {
        redirect('/onboarding')
    }

    const allUsers = await fetchUsers({
        userId: user.id,
        searchString: resSearchParams.q,
        pageNumber: resSearchParams?.page ? +resSearchParams.page : 1,
        pageSize: 25
    })
    
    return (
        <section>
            <h1 className="text-[30px] font-bold leading-[140%] text-white mb-10">
                Search
            </h1>
            <Searchbar routeType="/search" />
            <div className="mt-14 flex flex-col gap-9">
                {allUsers?.users?.length === 0 ? (
                    <p className="text-center text-base font-normal leading-[140%] text-[#7878A3]">No Users</p>
                ) : (
                    <>
                        {allUsers.users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType="User"
                            />
                        ))}
                    </>
                )}
            </div>
            <Pagination 
                path="search"
                pageNumber={resSearchParams?.page ? +resSearchParams.page : 1}
                isNext={allUsers.isNext}
            />
        </section>
    )
}

export default Search