import fs from "fs";
import path from "path";
import Link from "next/link";
import LessonViewer from "@/components/LessonViewer";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string; pageId: string }>;
}) {
  // Await the params Promise
  const { courseId, lessonId, pageId } = await params;
  
  const lessonDir = path.join(
    process.cwd(),
    "content",
    "courses",
    courseId,
    lessonId
  );
  
  const pageFiles = fs
    .readdirSync(lessonDir)
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => {
      const na = parseInt(a.match(/page-(\d+)/)?.[1] || "0", 10);
      const nb = parseInt(b.match(/page-(\d+)/)?.[1] || "0", 10);
      return na - nb;
    });
    
  const idx = pageFiles.findIndex((f) => f === `${pageId}.json`);
  const prev = idx > 0 ? pageFiles[idx - 1].replace(/\.json$/, "") : null;
  const next = idx < pageFiles.length - 1 ? pageFiles[idx + 1].replace(/\.json$/, "") : null;
  
  const raw = fs.readFileSync(path.join(lessonDir, `${pageId}.json`), "utf-8");
  const { title, markdown } = JSON.parse(raw) as { title: string; markdown: string };
  
  return (
    <div className="min-h-screen bg-[#EEF1F9] flex flex-col">
      <nav className="h-16 w-full bg-[#F2F3F7] flex items-center px-6">
        <div className="relative w-8 h-8">
          <Image src="/SVGs/mod-logo.svg" alt="Modulus logo" fill priority />
        </div>
        <div className="ml-12 space-x-4">
          <Link href="/" className="px-4 py-2 hover:bg-[#d9dadd]">Home</Link>
          <Link href="/dashboard" className="px-4 py-2 hover:bg-[#d9dadd]">Dashboard</Link>
          <Link href="/courses" className="px-4 py-2 hover:bg-[#d9dadd]">Courses</Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <LessonViewer title={title} markdown={markdown} background="#FFFFFF" />
        <div className="mt-8 flex space-x-4">
          {prev && (
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/${prev}`}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ← Previous
            </Link>
          )}
          {next && (
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/${next}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}