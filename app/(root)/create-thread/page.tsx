import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { PostThread } from "@/components/forms"
import { fetchUser } from "@/lib/actions/user.actions"

async function CreateThread() {
    const user = await currentUser()

    if(!user){
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)

    
    if(!userInfo?.onboarded){
        redirect('/onboarding')
    }

    return (
        <>
            <h1 className="text-[30px] font-bold leading-[140%] text-white">
                Create Thread    
            </h1>
            <PostThread userId={userInfo._id.toString()} />
        </>
    )
}

export default CreateThread