import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import UserProfileButton from '@/components/userprofilebutton';
import CourseTopBar from '@/components/coursestopbar';
import { getUserFromSession } from '@/lib/auth';
import { pool } from '@/lib/database';

{/*TODO 
  Add progress bar functionality
  Gray out unavailable courses automatically.

  
  
  */}

export default async function CourseDashboard() {
  const user = await getUserFromSession();
  const firstName = user?.firstName || 'Guest';


  

  const coursesDir = path.join(process.cwd(), 'content', 'courses');
  const courseIds = fs
    .readdirSync(coursesDir)
    .filter((name) => fs.statSync(path.join(coursesDir, name)).isDirectory());

 
  const courses = courseIds.map((courseId) => {
    const infoPath = path.join(coursesDir, courseId, 'info.json');
    let displayName = courseId;
    try {
      const infoRaw = fs.readFileSync(infoPath, 'utf-8');
      const info = JSON.parse(infoRaw);
      if (info.name) displayName = info.name;
    } catch {
    }
    return { id: courseId, name: displayName };
  });

  return (
    <main className="bg-gray-200 min-h-screen">
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

      <CourseTopBar status={0} current="Courses" o0="All Courses" o1='My Courses' o2='Archived Courses' o3='Course Settings' />

      <div className="flex items-center justify-center mt-12">
        <div className="w-11/12 h-screen bg-[#F2F3F7] rounded-2xl drop-shadow-xl">
          <section className="mx-12 py-16 flex flex-row ">
            <h1 className="text-3xl font-bold">Welcome <span className='text-[#CE73B7]'>{firstName} </span> </h1>
          </section>

          <section className="mx-12 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <div className="relative w-full h-58">
                    <Image
                      src={`/images/${course.id}-banner.png`}
                      alt={`${course.name} banner`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* progress part */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {/* star svg */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          course.id === 'calculusI' ? 'bg-purple-500' : 
                          course.id === 'physicsI' ? 'bg-green-400' : 
                          course.id === 'chemistry' ? 'bg-blue-500' : 
                          'bg-gray-500'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{course.name}</h2>
                          <p className="text-sm text-gray-500">definition of a limit</p>
                        </div>
                      </div>
                      
                      {/* arrow svg */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        course.id === 'calculusI' ? 'bg-purple-500' : 
                        course.id === 'physicsI' ? 'bg-green-400' : 
                        course.id === 'chemistry' ? 'bg-blue-500' : 
                        'bg-gray-500'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          course.id === 'calculusI' ? 'bg-purple-500' : 
                          course.id === 'physicsI' ? 'bg-green-400' : 
                          course.id === 'chemistry' ? 'bg-blue-500' : 
                          'bg-gray-500'
                        }`}
                        style={{ width: '35%' }} 
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
