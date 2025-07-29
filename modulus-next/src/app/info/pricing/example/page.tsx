import React from 'react';

const ModulusPricingCard = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F1F0F8] py-2 sm:py-12">
      {/* Floating Background Elements */}
      <div className="animate-bounce">
        <div className="absolute inset-auto h-60 w-60 -translate-x-8 scale-50 rounded-full bg-gradient-to-br from-red-300 via-pink-400 to-purple-200 sm:translate-x-20 sm:translate-y-28 sm:scale-100"></div>
      </div>
      <div className="animate-pulse scale-50 sm:scale-100">
        <div className="absolute inset-auto h-60 w-60 -translate-x-56 -translate-y-2 scale-50 rounded-full bg-gradient-to-tr from-red-300 via-pink-300 to-orange-100 sm:-translate-x-80 sm:-translate-y-28 sm:scale-100"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#262f70] mb-4">
            Modulus
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Personalized, curriculum-aligned learning for engineering students
          </p>
        </div>
        
        {/* Pricing Card */}
        <div className="scale-90 sm:scale-100">
          <div className="hover:transform hover:-translate-y-2 transition-all duration-300 pointer-events-auto relative z-10 w-[400px] select-none rounded-3xl bg-white/30 p-8 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl">
            {/* Launch Special Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="animate-pulse bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                🚀 Launch Special
              </div>
            </div>
            
            {/* Card Content */}
            <div className="mt-6 text-center">
              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-[#262f70] mb-2">
                Premium Access
              </h2>
              
              {/* Launch Offer */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  FREE
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  First semester free for early adopters
                </div>
                <div className="text-lg text-gray-700">
                  Then <span className="font-semibold text-[#262f70]">$7.99 CAD</span>/month
                </div>
              </div>
              
              {/* Features List */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Adaptive Learning Engine</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">University-Specific Content</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">AI Learning Assistant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Exam & Course Prep Modes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Gamified Learning Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Progress Tracking & Analytics</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-[#262f70] to-[#3b4aa0] text-white font-semibold py-4 px-6 rounded-2xl hover:from-[#1a2050] hover:to-[#2d3780] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Free Semester
              </button>
              
              {/* Fine Print */}
              <div className="mt-4 text-xs text-gray-500">
                No credit card required • Cancel anytime<br />
                Perfect for first-year engineering students
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-orange-200/50 to-red-200/50 rounded-full blur-lg"></div>
          </div>
        </div>
        
        {/* Target Audience Info */}
        <div className="text-center mt-8 max-w-md">
          <p className="text-sm text-gray-600">
            Designed specifically for engineering students at Western University and beyond. 
            Join thousands of students improving their academic performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModulusPricingCard;