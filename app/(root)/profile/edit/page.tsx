import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { fetchUser } from "@/lib/actions/user.actions"
import { AccountProfile } from "@/components/forms"

async function EditProfile() {
    const user = await currentUser()

    if(!user){
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) {
        redirect("/onboarding")
    }

    const userData = {
        id: user.id,
        objectId: userInfo?._id.toString(),
        username: userInfo ? userInfo?.username : user.username,
        name: userInfo ? userInfo?.name : user.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user.imageUrl
    }

    return (
        <>
            <h1 className="text-[30px] font-bold leading-[140%] text-white">
                Edit Profile
            </h1>
            <p className="mt-3 text-base font-normal leading-[140%] text-[#efefef]">
                Make Any Changes
            </p>
            <section className="mt-12">
                <AccountProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>   
        </>
    )
}

export default EditProfile