import Image from "next/image"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { fetchUser } from "@/lib/actions/user.actions"
import { ProfileHeader, ThreadsTab } from "@/components/shared"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"

async function Profile({ params }: { params: Promise<{ id: string }> }) {
    const resParams = await params
    const user = await currentUser()
    if(!user) {
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(resParams.id)

    if(!userInfo?.onboarded) {
        redirect('/onboarding')
    }

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                bio={userInfo.bio}
                imgUrl={userInfo.image}
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="flex w-full min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#efefef] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#efefef]">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="flex w-full cursor-pointer min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#efefef] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#efefef]">
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
                                        {userInfo?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-white">
                            <ThreadsTab
                                accountId={userInfo.id}
                                currentUserId={user.id}
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Profile