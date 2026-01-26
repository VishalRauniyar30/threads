"use client";

import Image from "next/image";
import Link from "next/link";

interface ReplyCardProps {
    id: string;
    text: string;
    parentId: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        image: string;
    };
}

function ReplyCard({
    id,
    text,
    parentId,
    createdAt,
    author,
} : ReplyCardProps) {
    return (
        <Link href={`/thread/${parentId}`}>
            <article className="flex gap-3 rounded-lg bg-[#121417] p-4 hover:bg-[#1a1d21] transition mt-5">
                <Image
                    src={author.image}
                    alt={author.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                />

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                            {author.name}
                        </p>
                        <span className="text-xs text-[#7878A3]">
                            replied · {new Date(createdAt).toLocaleString()}
                        </span>
                    </div>
                    <p className="text-sm text-[#EFEFEF] line-clamp-2">
                        {text}
                    </p>
                </div>
            </article>
        </Link>
    )
}

export default ReplyCard