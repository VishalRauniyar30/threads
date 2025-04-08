'use client'

import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface DeleteThreadProps {
    threadId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isComment?: boolean;
}

function DeleteThread({ 
    threadId, currentUserId,
    authorId, parentId, isComment
}: DeleteThreadProps) {
    const pathname = usePathname()
    const router = useRouter()

    if(currentUserId !== authorId || pathname === '/'){
        return null
    }

    const handleClick = async () => {
        await deleteThread(JSON.stringify(threadId), pathname)
        if(!parentId || !isComment) {
            router.push('/')
        }
    }

    return (
        <Image 
            src='/assets/delete.svg'
            width={18}
            height={18}
            alt="delete"
            className="cursor-pointer object-contain"
            onClick={handleClick}
        />
    )
}

export default DeleteThread