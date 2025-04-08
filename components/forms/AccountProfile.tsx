'use client'

import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { usePathname, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '../ui/form'
import { UserValidation } from '@/lib/validations/user'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'

interface AccountProfileProps {
    user: {
        id: string;
        objectId : string;
        username : string | null;
        name : string | null;
        bio : string;
        image : string;
    };
    btnTitle: string;
}

function AccountProfile ({ user, btnTitle }: AccountProfileProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { startUpload } = useUploadThing('media')

    const [files, setFiles] = useState<File[]>([])
    
    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        },
    })
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_photo

        const hasImageChanged = isBase64Image(blob)

        if(hasImageChanged) {
            const imgRes = await startUpload(files)
            
            if(imgRes && imgRes[0].ufsUrl) {
                values.profile_photo = imgRes[0].ufsUrl
            }
        }
        
        await updateUser({
            name: values.name,
            path: pathname,
            username: values.username,
            userId: user.id,
            bio: values.bio,
            image: values.profile_photo
        })

        if(pathname === '/profile/edit'){
            router.back()
        } else {
            router.push('/')
        }
    }

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        const fileReader = new FileReader()

        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0]
            setFiles(Array.from(e.target.files))

            if(!file.type.includes('image')){
                return
            }
            fileReader.onload = async (event) => {
                const imageDataUrl = event?.target?.result?.toString() || ""
                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    return (
        <Form { ...form }>
            <form className='flex flex-col justify-start gap-10' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    control={form.control}
                    name='profile_photo'
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-[#1F1F22]'>
                                {field?.value ? (
                                    <Image 
                                        src={field.value}
                                        alt='profile_icon'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image 
                                        src='/assets/profile.svg'
                                        alt='profile_icon'
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base font-semibold leading-[140%] text-gray-200'>
                                <Input 
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add Profile Photo'
                                    className='cursor-pointer border-none bg-transparent outline-none file:text-[#0095F6]'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base font-semibold leading-[140%] text-[#efefef]'>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    type='text'
                                    {...field}
                                    className='border border-[#1F1F22] bg-[#101012] text-[#ffffff] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base font-semibold leading-[140%] text-[#efefef]'>
                                UserName
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    type='text'
                                    className='border border-[#1F1F22] bg-[#101012] text-[#ffffff] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base font-semibold leading-[140%] text-[#efefef]'>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                    rows={10}
                                    className='border border-[#1F1F22] bg-[#101012] text-[#ffffff] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-[#877EFF] cursor-pointer'>
                    {btnTitle}
                </Button>
            </form>
        </Form>
    )
}

export default AccountProfile