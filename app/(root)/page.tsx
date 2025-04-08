import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { ThreadCard } from "@/components/cards"
import { Pagination } from "@/components/shared"
import { fetchUser } from "@/lib/actions/user.actions"
import { fetchPosts } from "@/lib/actions/thread.actions"

export default async function Home({ 
    searchParams 
}: { 
    searchParams: { [key: string]: string | undefined } 
}) {
    const user = await currentUser()
    if(!user) {
        return null
    }
    
    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded){
        redirect('/onboarding')
    }

    const result = await fetchPosts(searchParams.page ? +searchParams.page : 1, 30)
    
    return (
        <>
           <h1 className="text-left text-[30px] font-bold leading-[140%]">
                Home
            </h1>
            <section className="mt-9 flex flex-col gap-10">
                {result?.posts?.length === 0 ? (
                    <p className="text-center text-[#7878A3] text-base font-normal leading-[140%]">
                        No Thread Found
                    </p>
                ) : (
                    <>
                        {result.posts.map((post) => (
                            <ThreadCard 
                                key={post._id} 
                                id={post._id}
                                currentUserId={user.id}
                                parentId={post.parentId}
                                content={post.text}
                                author={post.author}
                                community={post.community}
                                createdAt={post.createdAt}
                                comments={post.children}
                            />
                        ))}
                    </>
                )}
            </section>
            <Pagination
                path="/"
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />
        </>
    )
}