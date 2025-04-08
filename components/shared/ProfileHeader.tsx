import Image from "next/image"
import Link from "next/link"

interface ProfileHeaderProps{
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    type?: string;
}

function ProfileHeader({ 
    accountId, authUserId, name,
    username, imgUrl, bio, type
} : ProfileHeaderProps) {

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image 
                            src={imgUrl}
                            alt="logo"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-[24px] font-bold leading-[140%] text-white">
                            {name}
                        </h2>
                        <p className="text-base font-medium leading-[140%] text-[#697C89]">
                            @{username}
                        </p>
                    </div>
                </div>
                {accountId === authUserId && type !== 'Community' && (
                    <Link href='/profile/edit'>
                        <div className="flex cursor-pointer gap-3 rounded-lg bg-[#101012] px-4 py-2">
                            <Image 
                                src='/assets/edit.svg'
                                alt="logout"
                                width={16}
                                height={16}
                            />
                            <p className="text-[#efefef] max-sm:hidden">
                                Edit
                            </p>
                        </div>
                    </Link>
                )}
            </div>
            <p className="mt-6 max-w-lg text-base font-normal leading-[140%] text-[#efefef]">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-[#101012]" />
        </div>
    )
}

export default ProfileHeader