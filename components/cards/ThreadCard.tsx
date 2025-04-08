import Image from "next/image"
import Link from "next/link"

import { DeleteThread } from "../forms"
import { formateDateString } from "@/lib/utils"

interface Props{
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
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
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean;
}

function ThreadCard({ 
    id, currentUserId, parentId,
    content, author, community,
    createdAt, comments, isComment
 }: Props) {

    return (
        <article className={`flex w-full flex-col rounded-xl ${!isComment ? 'bg-[#121417] sm:p-7' : 'px-0 sm:px-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="w-11 h-11 relative">
                            <Image 
                                src={author.image}
                                fill
                                alt="user-community-image"
                                className="cursor-pointer rounded-full w-full h-full"
                            />
                        </Link>
                        <div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base font-semibold leading-[140%] text-[#ffffff]">
                                {author.name}
                            </h4>
                        </Link>
                        <p className="mt-2 text-[14px] font-normal leading-[140%] text-[#EFEFEF]">
                            {content}
                        </p>
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image src='/assets/heart-gray.svg' width={24} height={24} alt="heart" className="cursor-pointer object-contain"/>
                                <Link href={`/thread/${id}`}>
                                    <Image src='/assets/reply.svg' width={24} height={24} alt="heart" className="cursor-pointer object-contain" />
                                </Link>
                                <Image src='/assets/repost.svg' width={24} height={24} alt="heart" className="cursor-pointer object-contain" />
                                <Image src='/assets/share.svg' width={24} height={24} alt="heart" className="cursor-pointer object-contain" />
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-[12px] font-medium leading-[16px]">
                                        {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <DeleteThread
                    threadId={JSON.stringify(id)}
                    currentUserId={currentUserId}
                    authorId={author.id}
                    parentId={parentId}
                    isComment={isComment}
                />
            </div>
            {!isComment && comments.length > 0 && (
                <div className="ml-1 mt-3 flex items-center gap-2">
                    {comments.slice(0,2).map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt="users"
                            width={24}
                            height={24}
                            className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                        />
                    ))}
                    <Link href={`/thread/${id}`}>
                        <p className="mt-1 text-[12px] font-medium leading-[16px] text-[#697C89]">
                            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                        </p>
                    </Link>
                </div>
            )}
            {!isComment && community && (
                <Link className="mt-5 flex items-center" href={`/communities/${community.id}`}>
                    <p className="text-[12px] font-medium leading-[16px] text-[#697C89]">
                        {formateDateString(createdAt)}
                        {community && ` - ${community.name} Community`}
                    </p>
                    <Image
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        className="ml-1 rounded-full object-cover"
                    />
                </Link>
            )}
        </article>
    )
}

export default ThreadCard