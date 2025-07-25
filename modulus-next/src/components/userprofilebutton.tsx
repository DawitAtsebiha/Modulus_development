"use client"; 
import Image from "next/image";

interface UserProfileButtonProps {
  imagesrc: string;
  name: string;
  university: string;
}


export default function UserProfileButton({imagesrc, name, university}: UserProfileButtonProps) {
    const username = name
    const useruniversity = university
    useruniversity.toUpperCase

    return (
        <div className="flex items-center gap-4">
            <Image src={imagesrc} width={25} height={25} priority alt="User Profile" className="rounded-full ring-2 ring-gray-300"></Image>
            <div className="font-medium dark:text-white">
                <div>{username}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{useruniversity}</div>
            </div>

        </div>
    )
}