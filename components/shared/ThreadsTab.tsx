import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { ThreadCard } from "../cards";

interface Result {
    name: string;
    image: string;
    id: string;
    threads: {
        _id: string;
        text: string;
        parenId: string | null;
        author: {
            name: string;
            image: string;
            id: string;
        };
        community: {
            id: string;
            name: string;
            image: string;
        } | null;
        createdAt: string;
        children: {
            author: {
                image: string;
            }
        }[];
    }[];
}

interface ThreadsTabProps {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: ThreadsTabProps) {
    let result : Result
    // if(accountType === 'Community') {
    //     result = await fetchCommunityPosts(accountId)
    // } else {
    //     result = await fetchUserPosts(accountId)
    // }
    result = await fetchUserPosts(accountId)

    if(!result) {
        redirect('/')
    }

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parenId}
                    content={thread.text}
                    author={
                        accountType === 'User' 
                        ? { name: result.name, image: result.image, id: result.id }
                        : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
                    }
                    community={
                        accountType === 'Community'
                        ? { name: result.name, image: result.image, id: result.id }
                        : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab