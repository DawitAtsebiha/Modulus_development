"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromReq } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import UserProfileButton from '@/components/userprofilebutton';
import CourseTopBar from '@/components/coursestopbar';



interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  uniAffiliation?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = (await res.json()) as User;
      setUser(data);
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  if (loading) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  return (
    <div>
      <nav className="h-16 w-full bg-[#F2F3F7] flex flex-row items-center px-6">
        <div className="relative w-8 h-8">
          <Image src="/SVGs/mod-logo.svg" alt="Modulus logo" fill priority />
        </div>
        <div className="ml-12 space-x-4">
          <Link href="/" className="px-4 py-2 hover:bg-[#d9dadd]">
            Home
          </Link>
          <Link href="/dashboard" className="px-4 py-2 hover:bg-[#d9dadd]">
            Dashboard
          </Link>
          <Link href="/courses" className="px-4 py-2 hover:bg-[#d9dadd]">
            Courses
          </Link>
        </div>
        <div className="ml-auto px-5">
          <UserProfileButton
            imagesrc="/SVGs/mod-logo.svg"
            name={user?.firstName ?? 'User'}
            university={user?.uniAffiliation ?? 'UNIVERSITY'}
          />
        </div>
      </nav>
    
    <CourseTopBar status={0} current='Dashboard' o0='Overview' o1='Statistics' o2='Account'  ></CourseTopBar>

    
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {user && (
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="font-semibold">User ID</dt>
            <dd>{user.id}</dd>
          </div>
          <div>
            <dt className="font-semibold">Name</dt>
            <dd>{user.firstName} {user.lastName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="font-semibold">Joined</dt>
            <dd>{new Date(user.dateOfBirth).toLocaleDateString()}</dd>
          </div>
        </dl>
      )}
    </div>
    </div>
  );
}
