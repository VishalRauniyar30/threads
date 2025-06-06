import Image from "next/image"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { UserCard } from "@/components/cards"
import { ProfileHeader, ThreadsTab } from "@/components/shared"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communityTabs } from "@/constants"
import { fetchCommunityDetails } from "@/lib/actions/community.actions"

async function Community({ params }: { params: Promise<{ id: string }> }) {
    const resParams = await params
    
    const user = await currentUser()
    if(!user) {
        redirect('/sign-in')
    }

    const communityDetails = await fetchCommunityDetails(resParams.id)

    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.createdBy.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="flex w-full min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#efefef] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#efefef]">
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="flex cursor-pointer min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#efefef] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#efefef]">
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-[#5C5C7B] px-2 py-1 text-[10px] font-medium leading-[140%] text-[#efefef]">
                                        {communityDetails.threads.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value='threads' className="w-full text-white">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value="members" className="mt-9 w-full text-white">
                        <section className="mt-9 flex flex-col gap-10">
                            {communityDetails.members.map((member: any) => (
                                <UserCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User"
                                />
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value='requests' className="w-full text-white">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Community