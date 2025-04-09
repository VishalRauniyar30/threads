import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { fetchUser, getActivity } from "@/lib/actions/user.actions"

async function Activity() {
    const user = await currentUser()
    if(!user) {
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) {
        redirect('/onboarding')
    }

    const activity = await getActivity(userInfo._id)
    
    return (
        <section>
            <h1 className="text-[30px] font-bold leading-[140%] text-white">
                Activity
            </h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity?.length === 0 ? (
                    <p className="text-base text-center font-normal leading-[140%] text-[#7878A3]">
                        No Activity Yet
                    </p>
                ) : (
                    <>
                        {activity.map((activity) => (
                            <Link href={`/thread/${activity.parentId}`} key={activity._id}>
                                <article className="flex items-center gap-2 rounded-md bg-[#121417] px-7 py-4">
                                    <Image 
                                        src={activity.author.image}
                                        alt="author logo"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover w-5 h-5"
                                    />
                                    <p className="text-[14px] font-normal leading-[140%] text-white">
                                        <span className="mr-1 text-[#877EFF]">
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                )}
            </section>
        </section>
    )
}

export default Activity