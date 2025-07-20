"use client"; 

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface LessonViewerProps {
  title: string;
  markdown: string;
}

export default function LessonViewer({ title, markdown }: LessonViewerProps) {
  return (
    <article className="prose prose-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}