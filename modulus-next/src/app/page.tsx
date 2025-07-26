"use client";

import "../styles/globals.css";
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
      });
    }
    return () => {
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.removeEventListener('click', () => {
          mobileMenu.classList.toggle('active');
        });
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Modulus</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/CSS/output.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
        </style>
        
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"
        strategy="beforeInteractive"
      />

      {/* Global styles and keyframes */}
      <style jsx global>{`
        html, body { overflow-x: hidden; }
        html { scroll-behavior: smooth; }

        /* mobile menu toggle */
        .mobile-menu { display: none; }
        .mobile-menu.active { display: block; }

        @keyframes gradientMove {
          0%   { background-position: 0% 0%; }
          50%  { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }

        .gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 12s ease infinite;
        }
        .gradient-faster {
          background-size: 200% 200%;
          animation: gradientMove 7s ease infinite;
        }
      `}</style>

      <div className="font-[Montserrat]">
        {/* NAV BAR */}
        <div className="w-screen flex items-center justify-between p-12 h-16 md:h-18 px-4 md:px-12 relative bg-[#F1F0F8]">
          <div className="w-[32px] mt-1">
            <Image 
              src="/visuals/SVGs/mod-logo.svg" 
              alt="Modulus Logo" 
              width={32}
              height={32}
            />
          </div>

          <div className="text-3xl font-extrabold drop-shadow-2xl ml-2">
            modulus
          </div>

          {/* desktop links */}
          <div className="hidden md:flex flex-1 mr-5 justify-center space-x-8">
            <a href="#Features" className="text-gray-800 hover:text-gray-600 hover:border-b-2 hover:border-b-[#C974C7]">
              features
            </a>
            <a href="#Demo" className="text-gray-800 hover:text-gray-600 hover:border-b-2 hover:border-b-[#C974C7]">
              demo
            </a>
            <a href="#Pricing" className="text-gray-800 hover:text-gray-600 hover:border-b-2 hover:border-b-[#C974C7]">
              contact
            </a>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link href="/login" className="px-6 py-2 bg-white border border-gray-300 rounded-full text-black font-semibold shadow-sm text-md hover:shadow-[4px_4px_0px_0px_rgba(201,116,199)] transition duration-200">
              Log In
            </Link>
          </div>

          {/* mobile menu button */}
          <button id="mobile-menu-btn" className="md:hidden flex flex-col space-y-1 p-2">
            <span className="w-6 h-0.5 bg-black" />
            <span className="w-6 h-0.5 bg-black" />
            <span className="w-6 h-0.5 bg-black" />
          </button>

          {/* mobile menu */}
          <div id="mobile-menu" className="mobile-menu absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#Features" className="text-gray-800 py-2 border-b border-gray-100">features</a>
              <a href="#Demo" className="text-gray-800 py-2 border-b border-gray-100">demo</a>
              <a href="#Pricing" className="text-gray-800 py-2 border-b border-gray-100">contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login" className="px-4 py-2 rounded-md border border-black bg-white text-black text-md">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1 */}
        <div className="flex w-screen h-screen bg-[#F1F0F8] font-[Montserrat]">
          {/* LEFT SECTION */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center mb-32 lg:ml-12">
            <div className="lg:text-9xl drop-shadow-2xl font-bold text-center text-5xl md:text-5xl">
              <span>Learn What </span>
              <span className="gradient-faster bg-gradient-to-b from-fuchsia-500 to-indigo-600 bg-clip-text text-transparent text-5xl lg:text-9xl">Matters</span>
            </div>
            <div className="w-4/5 lg:w-3/5 pt-8 lg:text-2xl text-md drop-shadow-2xl text-center text-gray-500 font-[Inter]">
              Personalized study paths built from your engineering curriculum. Master tough concepts, reinforce them with smart practice, and walk into every exam confident.
            </div>
            <div className="mt-12">
              <a href="#" className="lg:px-12 lg:py-4 px-6 py-2 bg-white border border-gray-300 rounded-full text-black font-semibold shadow-sm text-sm lg:text-2xl hover:shadow-[4px_4px_0px_0px_rgba(201,116,199)] transition duration-200 inline-block">
                Start Learning
              </a>
            </div>
          </div>
          {/* RIGHT SECTION */}
          <div className="hidden md:w-1/2 lg:w-1/2 lg:flex items-center justify-center">
            <div className="gradient-move bg-gradient-to-b from-fuchsia-500 to-blue-900 w-4/12 h-2/3 mb-20 rounded-3xl absolute z-10 top-1/4 left-3/5 drop-shadow-2xl" />
            <div className="bg-[#E8EAF1] w-2/6 h-2/3 mb-20 rounded-3xl absolute z-20 drop-shadow-xl" />
          </div>
        </div>

        {/* BANNER 1 */}
        <section className="relative lg:py-16 bg-[#dbdcdd] overflow-hidden">
          {/* ORB */}
          <div className="absolute top-5 right-70 lg:w-72 lg:h-72 w-32 h-32 bg-pink-400 rounded-full filter blur-3xl lg:opacity-70 opacity-90 transform translate-x-1/2 -translate-y-1/2" />
          <div className="relative w-full max-w-4xl mx-auto bg-gray-600 bg-opacity-30 h-1/5 backdrop-blur-md" />
          <div className="lg:text-3xl text-xl md:text-3xl text-gray-500 text-center pb-6 lg:-mt-10 mt-5 tracking-wider">
            Designed for top engineering universities in Canada
          </div>
          <div className="flex lg:flex-row md:flex-row lg:space-x-60 space-x-12 md:space-x-2 mt-4 justify-center items-center drop-shadow-2xl">
            <Image src="/visuals/PNGs/westerntext.png" alt="Western University" width={320} height={80} className="lg:w-80 md:w-60 w-24 aspect-auto" />
            <Image src="/visuals/PNGs/uoftlogowhitetext.png" alt="University of Toronto" width={400} height={100} className="lg:w-100 md:w-80 w-24 aspect-auto" />
            <Image src="/visuals/PNGs/yorku logo.png" alt="York University" width={320} height={80} className="lg:w-80 md:w-60 w-24 aspect-auto" />
          </div>
        </section>

        {/* SECTION 2 */}
        <div className="h-screen font-[Montserrat]">
          <div className="flex flex-col md:flex-row bg-[#F1F0F8] h-11/12 text-shadow-2xs space-y-4 md:space-y-0 md:space-x-2 px-4 md:px-0">
            {/* step 1 */}
            <div className="relative flex-1 w-full md:w-auto">
              <span className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center tracking-widest text-3xl text-gray-900">
                step 1
              </span>
              <div className="absolute inset-x-3 bottom-50 left-11 mx-auto w-2/3 h-3/5 bg-gradient-to-b from-fuchsia-500 to-blue-900 rounded-3xl drop-shadow-2xl" />
              <div className="absolute inset-x-0 bottom-1/4 mx-auto w-2/3 h-3/5 bg-[#E8EAF1] rounded-3xl drop-shadow-xl">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="mt-6 text-2xl text-gray-600 font-light">Precision Setup</div>
                  <div className="text-center mt-12 text-[#94709E] w-3/4">
                    Tell us your university, courses, and professors. We&apos;ll build your
                    personalized curriculum map.
                  </div>
                </div>
              </div>
            </div>

            {/* step 2 */}
            <div className="relative flex-1 w-full md:w-auto">
              <span className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center tracking-widest text-3xl text-gray-900">
                step 2
              </span>
              <div className="absolute inset-x-3 bottom-50 mx-auto w-2/3 h-3/5 bg-gradient-to-b from-fuchsia-500 to-blue-900 rounded-3xl drop-shadow-2xl" />
              <div className="absolute inset-x-0 bottom-1/4 mx-auto w-2/3 h-3/5 bg-[#E8EAF1] rounded-3xl drop-shadow-xl">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="mt-6 text-2xl text-gray-600 font-light">Intelligent Learning</div>
                  <div className="text-center mt-12 text-[#94709E] w-3/4">
                    Follow your custom study path with interactive lessons,
                    targeted practice problems, and instant comprehension checks.
                  </div>
                </div>
              </div>
            </div>

            {/* step 3 */}
            <div className="relative flex-1 w-full md:w-auto">
              <span className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center tracking-widest text-3xl text-gray-900">
                step 3
              </span>
              <div className="absolute inset-x-3 bottom-50 right-11 mx-auto w-2/3 h-3/5 bg-gradient-to-b from-fuchsia-500 to-blue-900 rounded-3xl drop-shadow-2xl" />
              <div className="absolute inset-x-0 bottom-1/4 mx-auto w-2/3 h-3/5 bg-[#E8EAF1] rounded-3xl drop-shadow-xl">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="mt-6 text-2xl text-gray-600 font-light">Exam Mastery</div>
                  <div className="text-center mt-12 text-[#94709E] w-3/4">
                    Walk into every exam confident, prepared, and ready to demonstrate
                    your engineering knowledge.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1/12 bg-[#F1F0F8]"></div>
        </div>

        {/* SECTION 3 */}
        <div className="w-screen h-screen bg-[#F1F0F8]">
          <div className="flex-row flex">
            <div className="flex w-1/2 justify-center items-center">
              <div className="max-w-10/12 font-bold text-8xl mt-12 ml-24">
                study with precision, pass with confidence.
              </div>
            </div>
            <div className="relative">
              <div className="absolute bottom-16 w-96 h-72 bg-pink-400 rounded-full filter blur-3xl opacity-70 transform right-96 -translate-x-full -translate-y-1/2" />
            </div>
            <div className="w-1/2 flex items-center justify-center mr-24">
              <div className="relative gradient-move bg-gradient-to-b from-fuchsia-500 to-blue-900 w-screen h-[600px] mb-20 rounded-3xl z-10 top-1/12 left-6 drop-shadow-2xl" />
              <div className="bg-[#E8EAF1] w-3/6 h-2/3 mb-20 rounded-3xl absolute z-20 drop-shadow-xl justify-center items-center flex">
                <img
                  src="/visuals/PNGs/checklist.png"
                  className="max-w-9/12 justify-center items-center flex"
                  alt="Dashboard showing user's incoming midterm and optimal study plan to prepare"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="w-screen h-screen bg-[#F1F0F8]">
          <div className="flex flex-row">
            <div className="w-1/2 flex items-center justify-center mr-24">
              <div className="relative gradient-move bg-gradient-to-b from-fuchsia-500 to-blue-900 w-8/12 h-[800px] mb-20 rounded-3xl z-10 top-6 right-10 drop-shadow-2xl" />
              <div className="bg-[#E8EAF1] w-2/6 h-5/6 mb-20 rounded-3xl absolute z-20 drop-shadow-xl justify-center items-center flex">
                {/* PUT CHAT BOT HERE */}
              </div>
            </div>
            <div className="w-1/2 flex items-center justify-center flex-col">
              <div className="text-8xl font-bold">
                12 hours of effort should lead to <span className="text-green-600 font-extrabold">confidence</span>, not <span className="text-red-600">confusion.</span>
              </div>
              <div className="pt-12 font-medium text-4xl text-gray-600">
                Using The Modulus, you&apos;ll spend less time studying while getting the grades you want.
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <section className="relative py-16 bg-[#e6e6e6] overflow-hidden">
          {/* ORB */}
          <div className="absolute top-5 left-24 w-72 h-72 bg-pink-400 rounded-full filter blur-3xl opacity-50 transform -translate-y-1/2" />

          <div className="relative w-full max-w-4xl mx-auto bg-gray-600 bg-opacity-30 h-1/5 backdrop-blur-md" />

          <div className="flex flex-row space-x-60 mt-4 justify-center items-center text-shadow-lg text-7xl text-center font-bold text-white">
            <div>
              40+ <br />
              <span className="text-3xl">Lessons</span>
            </div>
            <div>
              100+ <br />
              <span className="text-3xl">interactive modules</span>
            </div>
            <div>
              3+ <br />
              <span className="text-3xl">universities</span>
            </div>
          </div>

          <div className="text-5xl text-gray-500 text-center pb-6 mt-12 tracking-wider font-bold text-shadow-2xs">
            ... and growing.
          </div>
        </section>

        {/* SECTION 5 */}
        <div className="w-screen h-screen bg-[#E8EAF1] flex justify-center items-center">
          <div className="relative w-10/12 h-10/12 bg-[#dedee6] rounded-3xl z-20 drop-shadow-2xl overflow-hidden">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-7/12 h-1/12 bg-[#E8EAF1] rounded-b-full z-30 bg-gradient-to-b from-fuchsia-500 to-blue-900 drop-shadow-2xl gradient-move shadow-2xl" />
            {/* … your front-card content here … */}
          </div>

          <div className="gradient-move absolute w-10/12 h-10/12 rounded-3xl z-10 mt-12 bg-gradient-to-b from-fuchsia-500 to-blue-900 drop-shadow-2xl" />
        </div>

        {/* SECTION 6 */}
        <div className="w-screen h-screen bg-[#F1F0F8] flex flex-col">
          <div className="flex flex-row w-full items-center justify-center mt-80">
            <img
              src="/visuals/SVGs/mod-logo.svg"
              className="w-1/12 mt-8 mr-5"
              alt="Modulus logo"
            />
            <div className="text-9xl font-bold">modulus</div>
          </div>
          <div className="flex justify-center items-center">
            <div className="hidden md:flex space-x-4">
              <a
                href="/login"
                className="px-12 py-2 bg-white border border-gray-300 rounded-full text-black font-semibold shadow-sm text-2xl hover:shadow-[4px_4px_0px_0px_rgba(201,116,199)] transition duration-200"
              >
                Start Learning
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="relative overflow-hidden bg-black flex flex-row text-white pt-24 pb-0">
          <section className="mx-auto w-full max-w-[--breakpoint-xl] px-6 grid items-center gap-10 md:grid-cols-2 md:items-start">
            <div className="flex flex-col items-center gap-8 md:items-start">
              <div className="flex flex-col items-center gap-4 md:items-start pb-24">
                <div className="font-bold text-2xl">modulus</div>
                <div>© 2025, modulus inc.</div>
                <a href="#" className="border-2 border-white rounded-xl px-4 py-2 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 inline-block">
                  Contact
                </a>
              </div>
            </div>
            <div className="hidden md:flex lg:gap-24 md:gap-10 xl:gap-32 sm:flex">
              <div className="flex flex-col gap-3">
                <span className="font-bold">SERVICE</span>
                <a href="#">Pricing</a>
                <a href="#">Referral Program</a>
                <a href="#">Privacy & Terms of Service</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-bold">OTHER</span>
                <a href="#">Contact Us</a>
                <a href="#">Guide</a>
                <a href="#">Changelog</a>
              </div>
            </div>
          </section>
        </footer>
      </div>
    </>
  );
}