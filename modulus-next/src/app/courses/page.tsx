// src/app/courses/page.tsx

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import UserProfileButton from '@/components/userprofilebutton';


export default function CourseDashboard() {
  const coursesDir = path.join(process.cwd(), 'content', 'courses');
  const courseIds = fs
    .readdirSync(coursesDir)
    .filter((name) =>
      fs.statSync(path.join(coursesDir, name)).isDirectory()
    );

  const courses = courseIds.map((courseId) => {
    const infoPath = path.join(coursesDir, courseId, 'info.json');
    let displayName = courseId;
    try {
      const infoRaw = fs.readFileSync(infoPath, 'utf-8');
      const info = JSON.parse(infoRaw);
      if (info.name) displayName = info.name;


    } catch {

    }
    return { id: courseId, name: displayName}
  })
  

  return (
    <main className="bg-gray-200 min-h-screen">
      <nav className="h-16 w-full bg-[#F2F3F7] flex flex-row items-center px-6">
        <div className="relative w-8 h-8">
          <Image
            src="/SVGs/mod-logo.svg"
            alt="Modulus logo"
            fill
            priority
          />
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
        <div className='ml-auto px-5'>
          <UserProfileButton imagesrc='/SVGs/mod-logo.svg' name='Muslum' university='YORK UNIVERSITY'></UserProfileButton>
          </div>
      </nav>

      <section className="mx-12 py-16">
        <h1 className="text-3xl font-bold">Course Dashboard</h1>
      </section>

      <section className="mx-12 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`/images/${course.id}-banner.png`}
                  alt={`${course.name} banner`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{course.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
