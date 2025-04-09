'use client'

import { useForm } from "react-hook-form"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { CommentValidation } from "@/lib/validations/thread"
import { addCommentToThread } from "@/lib/actions/thread.actions"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

function Comment({ threadId, currentUserId, currentUserImg }: Props) {
    const pathname = usePathname()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)

        form.reset()
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex items-center gap-4 border-y border-y-[#1F1F22] py-5 max-sm:flex-col"
            >
                <FormField 
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center gap-3">
                            <FormLabel>
                                <Image 
                                    src={currentUserImg}
                                    width={48}
                                    height={48}
                                    alt="current_user"
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input 
                                    type="text"
                                    {...field}
                                    placeholder="Comment..."
                                    className="no-focus text-white outline-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="rounded-3xl bg-[#877EFF] px-8 py-2 text-[14px] font-normal leading[140%] max-sm:w-full cursor-pointer">
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment