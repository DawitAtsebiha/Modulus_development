import fs from "fs";
import path from "path";
import LessonViewer from "@/components/LessonViewer";

import Image from "next/image"

type Params = {
  params: {
    courseId: string;
    lessonId: string;
    pageId: string;
  };
};

export async function generateStaticParams() {
  const baseDir = path.join(process.cwd(), "content", "lessons");
  const courses = fs.readdirSync(baseDir);
  const allParams: Array<{ courseId: string; lessonId: string; pageId: string }> = [];

  for (const courseId of courses) {
    const lessonsDir = path.join(baseDir, courseId);
    const lessonIds = fs.readdirSync(lessonsDir);

    for (const lessonId of lessonIds) {
      const pagesDir = path.join(lessonsDir, lessonId);
      const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".json"));

      for (const file of pageFiles) {
        const pageId = path.parse(file).name; 
        allParams.push({ courseId, lessonId, pageId });
      }
    }
  }

  return allParams.map(({ courseId, lessonId, pageId }) => ({
    courseId,
    lessonId,
    pageId,
  }));
}

export default async function Page({ params }: Params) {
  const { courseId, lessonId, pageId } = await params;

  const filePath = path.join(
    process.cwd(),
    "content",
    "lessons",
    courseId,
    lessonId,
    `${pageId}.json`
  );
  const raw = fs.readFileSync(filePath, "utf-8");
  const pageData = JSON.parse(raw) as { title: string; markdown: string };

  return (
    <>
    <nav className="h-16 w-screen   bg-[#F2F3F7] font-[Inter] absolute ">
      <div className="flex items-center justify-start flex-row">
    <Image src="/SVGs/mod-logo.svg" fill priority alt="modulus logo black" className="max-w-8 max-h-8 ml-6 mt-4"></Image>
    <div className="px-20 ">
        <button className="px-6 py-4 hover:bg-[#d9dadd] "><a href="">Home</a></button>
        <button className="px-6 py-4  hover:bg-[#d9dadd]">Dashboard</button>
        <button className="px-6 py-4 hover:bg-[#d9dadd]">Courses</button>
    </div>
    </div>
    </nav>
    <div className="w-screen h-screen bg-[#EEF1F9] flex items-center justify-center">
      <LessonViewer title={pageData.title} markdown={pageData.markdown} background="#F2F3F7"/>
    </div>
    </>
  );
}