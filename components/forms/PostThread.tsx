'use client'

import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useOrganization } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { ThreadValidation } from "@/lib/validations/thread"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { createThread } from "@/lib/actions/thread.actions"

interface Props {
    userId: string
}

function PostThread ({ userId }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const { organization } = useOrganization()

    const form = useForm<z.infer<typeof ThreadValidation>>({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname
        })
        
        router.push('/')
    }

    return (
        <Form { ...form }>
            <form 
                className="mt-10 flex flex-col justify-start gap-10"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField 
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="text-base font-semibold leading-[140%] text-[#EFEFEF]">
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-[#1F1F22] bg-[#101012] text-[#FFFFFF]">
                                <Textarea 
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-[#877EFF] cursor-pointer">
                    Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread