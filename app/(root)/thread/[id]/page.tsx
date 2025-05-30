import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { fetchUser } from "@/lib/actions/user.actions"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { ThreadCard } from "@/components/cards"
import { Comment } from "@/components/forms"

async function Thread({ params }: { params: Promise<{ id: string }> }) {
    const resParams = await params
    if(!resParams.id) {
        return null
    }

    const user = await currentUser()
    if(!user) {
        redirect('/sign-in')
    }

    const userInfo = await fetchUser(user.id)
    
    if(!userInfo?.onboarded) {
        redirect('/onboarding')
    }

    const thread = await fetchThreadById(resParams.id)

    return (
        <section className="relative">
            <div>
                <ThreadCard 
                    id={thread._id}
                    currentUserId={user.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {thread?.children?.map((child: any) => (
                    <ThreadCard
                        key={child._id}
                        id={child._id}
                        currentUserId={user.id || ""}
                        parentId={child.parentId}
                        content={child.text}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default Thread