"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface UserProfileButtonProps {
  imagesrc: string;
  name: string;
  university: string;
}

export default function UserProfileButton({ imagesrc, name, university }: UserProfileButtonProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-4 hover:bg-gray-100 px-3 py-1 rounded-md transition">
        <Image src={imagesrc} width={32} height={32} alt="User Profile" className="rounded-full ring-2 ring-gray-300" />
        <div className="text-left font-medium dark:text-white">
          <div>{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{university.toUpperCase()}</div>
        </div>
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m1 2 4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 bg-[#F2F3F7] rounded-lg shadow-lg dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a href="/dashboard" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a></li>
            <li><a href="/dashboard" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a></li>
            <li><a href="/referral" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Affiliate</a></li>
            <li><a href="/dashboard" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}