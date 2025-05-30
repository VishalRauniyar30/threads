import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { AccountProfile } from "@/components/forms"
import { fetchUser } from "@/lib/actions/user.actions"

async function Onboarding () {
    const user = await currentUser()

    if(!user) {
        return null
    }

    const userInfo = await fetchUser(user.id)
    
    if(userInfo?.onboarded){
        redirect('/')
    }
    
    const userData = {
        id: user.id,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user.username,
        name: userInfo ? userInfo?.name : user.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user.imageUrl
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="text-[30px] font-bold leading-[140%] text-white">
                Onboarding
            </h1>
            <p className="mt-3 text-base font-normal leading-[140%] text-[#EFEFEF]">
                Complete Your Profile Now, To Use Threads
            </p>
            <section className="mt-9 bg-[#121417] p-10">
                <AccountProfile user={userData} btnTitle="Continue" />
            </section>
        </main>
    )
}

export default Onboarding