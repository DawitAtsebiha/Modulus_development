'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


const FloatingCard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: rotate(-0.001deg) translate3d(15px, 0, 0) rotate(-0.001deg);
          }
          100% {
            transform: rotate(360.001deg) translate3d(15px, 0, 0) rotate(-360.001deg);
          }
        }
        
        .animate-float {
          animation: float 12s infinite linear;
        }
        
        .animate-float-fast {
          animation: float 10s infinite linear;
        }
        
        .animate-float-fastest {
          animation: float 8s infinite linear;
        }
        
        .mask::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8));
          padding: 1px;
          mask: linear-gradient(rgb(255, 255, 255) 0 0) content-box,
               linear-gradient(rgb(255, 255, 255) 0 0);
          -webkit-mask: linear-gradient(rgb(255, 255, 255) 0 0) content-box,
                       linear-gradient(rgb(255, 255, 255) 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
      
      <div className="font-[Montserrat]  absolute">
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

          <div className="text-3xl font-extrabold ml-2">
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
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col space-y-1 p-2"
          >
            <span className="w-6 h-0.5 bg-black" />
            <span className="w-6 h-0.5 bg-black" />
            <span className="w-6 h-0.5 bg-black" />
          </button>

          {/* mobile menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
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
          )}
        </div>
      
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F1F0F8] py-2 sm:py-12 ">
          <div className="animate-float ">
            <div className="absolute inset-auto h-60 w-60 -translate-x-8 scale-50 mt-30 rounded-full bg-gradient-to-br from-red-300 via-pink-400 to-purple-200 sm:translate-x-20 sm:translate-y-28 sm:scale-100"></div>
          </div>

          <div className="animate-float-fast scale-50 sm:scale-100">
            <div className="absolute inset-auto h-60 w-60 -translate-x-56 mt-20 scale-50 rounded-full bg-gradient-to-tr from-red-300 via-pink-300 to-orange-100 sm:-translate-x-80 sm:-translate-y-28 sm:scale-100"></div>
          </div>
            <div className='z-1 text-center pb-12'> <span className='text-5xl font-bold'>modulus</span><br />
              <br className=''/><span className='font-medium '> Personalized, curriculum-aligned learning for engineering students</span>
            </div>
          <div className="mb-32">
            <div className="scale-50 sm:scale-100">
              <div className=" mask pointer-events-none relative z-10 h-[600px] w-[500px] select-none rounded-3xl bg-gray-500/20 p-7 backdrop-blur-2xl flex flex-col text-center">
                <div className="items-center justify-center font-bold text-2xl text-[#CE73B7] py-4">    Premium Access      
                </div>
                <div className='text-5xl font-bold text-black drop-shadow-2xl mb-2'>FREE</div>
                <div className='text-sm'>First semester free for early adopters</div>
                <div className='text-xl mb-12'>then <span className='text-blue-950 font-medium'>$7.99 CAD/month</span> </div>
                
                <div className='items-center justify-center text-center '> 
                  <div className="space-y-4 mb-8 text-center justify-center items-center flex flex-col">
                <div className="flex items-center gap-3 " >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Adaptive Learning Engine</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">University-Specific Content</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">AI Learning Assistant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Exam & Course Prep Modes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Gamified Learning Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Progress Tracking & Analytics</span>
                </div>
              </div>
                  <div>
                      <Link 
                        href="/login" 
                        className="inline-block px-3 py-2 bg-white border border-gray-300 rounded-full text-black font-semibold shadow-sm text-md transition duration-200 hover:shadow-[4px_4px_0px_0px_theme(colors.purple.400)]"
                      >
                        Start Learning Now
                      </Link>
                    </div>  
                   </div>
                   
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingCard;