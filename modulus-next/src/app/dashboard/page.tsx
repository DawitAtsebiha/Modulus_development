"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromReq } from '@/lib/auth';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
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
  );
}
