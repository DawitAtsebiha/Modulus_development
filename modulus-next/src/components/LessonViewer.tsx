"use client"; 

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useState } from 'react';
import { usePopper } from 'react-popper'
import clsx from 'clsx';

import "katex/dist/katex.min.css";

interface LessonViewerProps {
  title: string;
  markdown: string;
  background: string;
}

// always pass background colour as a hex code with hashtag included.

export default function LessonViewer({ title, markdown, background }: LessonViewerProps) {
  const bgClass = 'bg-${#background}'
  return (
    <div>
    <article className={clsx('prose', 'prose-lg', 'mx-auto', 'p-6', 'w-11/12' ,'h-11/12', 'rounded-2xl')}
    style={{ backgroundColor: background}}>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
    </div>
  );
}