"use client";

import React, { useEffect } from "react";

interface CourseTopBarProps {
  status: number;
  current: string;
}

export default function CourseTopBar({ status, current }: CourseTopBarProps) {
    const currentUpper = current.toUpperCase()
  useEffect(() => {
    for (let i = 0; i <= 3; i++) {
      const el = document.getElementById(i.toString());
      if (el) el.classList.remove("border-b-5", "border-white");
    }

    const selectedEl = document.getElementById(status.toString());
    if (selectedEl) selectedEl.classList.add("border-b-5", "border-white");
  }, [status]);

  return (
<div className="w-screen h-4/12 bg-[#CE73B7] flex flex-col items-center justify-center text-center">
  <div className="font-[Montserrat] flex flex-col items-center text-center ">
    <h1 className="font-bold text-6xl text-white drop-shadow-2xl py-5 mt-6">{currentUpper}</h1>
    <ul className="flex space-x-6 mt-4 ">
      <li id="0" className="text-white font-semibold"><button><a href="">All Courses</a></button></li>
      <li id="1" className="text-white font-semibold"><button><a href="">My Courses</a></button></li>
      <li id="2" className="text-white font-semibold"><button><a href="">Archived Courses</a></button></li>
      <li id="3" className="text-white font-semibold"><button><a href="">Settings</a></button></li>
    </ul>
  </div>
</div>
  );
}