import { currentUser } from "@clerk/nextjs/server"

import { UserCard } from "../cards"

async function RightSidebar() {
    const user = await currentUser()
    
    if(!user) {
        return null
    }
    
    const similarMinds = { user: [{ id:1 }, { id: 2 }]}

    const suggestedCommunities = { commnunities: [{ id:1 }, { id: 2 }]}
    
    return (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-[#1F1F22] bg-[#121417] px-10 pb-6 pt-28 max-xl:hidden">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-[20px] font-medium leading-[140%] text-[#ffffff]">
                    Suggested Communities
                </h3>
                <div className="mt-7 flex w-[350px] flex-col gap-9">
                    {!suggestedCommunities.commnunities.length ? (
                        <>
                            {suggestedCommunities.commnunities.map((community) => (
                                <UserCard key={community.id} />
                            ))}
                        </>
                    ) : (
                        <p className="text-base leading-[140%] font-normal text-[#7878A3]">
                            No Communities yet
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-[20px] font-medium leading-[140%] text-[#ffffff]">
                    Similar Minds
                </h3>
                <div className="mt-7 flex w-[350px] flex-col gap-10">
                    {!similarMinds.user.length ? (
                        <>
                            {similarMinds.user.map((person) => (
                                <UserCard key={person.id} />
                            ))}
                        </>
                    ) : (
                        <p className="text-base leading-[140%] font-normal text-[#7878A3]">
                            No Users yet
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default RightSidebar