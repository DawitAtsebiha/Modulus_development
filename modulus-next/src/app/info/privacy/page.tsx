'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function PrivacyPage() {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
      const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      };
    

    return(
    <div>
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
        
     </div>
     <div className='w-screen flex justify-center'>
        <div className='w-2/5 flex  font-[Inter] py-16 text-left flex-col'>
                <span className='text-4xl font-extrabold drop-shadow-2xl py-16'>PRIVACY POLICY</span>


                    <div className="max-w-3xl mx-auto px-4 ">

      <p className="text-gray-500 mb-6">
        <strong>Effective Date:</strong> [7/30/2025]
      </p>

      <p className="text-gray-500 mb-4">
        At <strong>Modulus</strong>, accessible from themodulus.org, we value your privacy. This Privacy Policy outlines the types of information we collect, how we use it, and your rights regarding your personal data.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">1. Information We Collect</h2>
      <p className="text-gray-500 mb-2">We may collect the following types of information when you interact with our website:</p>

      <p className="text-gray-500 mb-2 font-bold">a. Personal Information (you provide directly)</p>
      <ul className="list-disc list-inside text-gray-500 mb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Feedback or messages sent via forms</li>
      </ul>

      <p className="text-gray-500 mb-2 font-bold">b. Usage Data (collected automatically)</p>
      <ul className="list-disc list-inside text-gray-500 mb-4">
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited and time spent</li>
        <li>Referring site or URL</li>
        <li>General location (country, city) via analytics</li>
      </ul>

      <p className="text-gray-500 mb-2 font-bold">c. Cookies and Tracking Technologies</p>
      <p className="text-gray-500 mb-4">
        We use cookies to improve your experience, such as remembering login sessions or tracking usage with analytics tools (like Google Analytics or Vercel Analytics).
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside text-gray-500 mb-4">
        <li>To operate and improve the Modulus platform</li>
        <li>To respond to inquiries or feedback</li>
        <li>To analyze user behavior and optimize performance</li>
        <li>To ensure security and prevent abuse</li>
      </ul>
      <p className="text-gray-500 mb-4">
        We do <strong>not</strong> sell or rent your data to third parties.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">3. Sharing Your Information</h2>
      <p className="text-gray-500 mb-4">
        We may share information with trusted third-party services that help us operate the website (e.g., analytics providers, hosting services), but only as necessary and under strict confidentiality agreements.
      </p>
      <p className="text-gray-500 mb-4">
        We may also disclose information if required by law or to protect our legal rights.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">4. Your Rights and Choices</h2>
      <ul className="list-disc list-inside text-gray-500 mb-4">
        <li>Request access to the personal data we hold about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Opt-out of analytics tracking (via browser settings or privacy tools)</li>
      </ul>
      <p className="text-gray-500 mb-4">
        To exercise any of these rights, contact us at: <strong>[your email address]</strong>
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">5. Data Retention</h2>
      <p className="text-gray-500 mb-4">
        We retain your data only for as long as necessary to fulfill the purposes described above or as required by law.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">6. Children's Privacy</h2>
      <p className="text-gray-500 mb-4">
        Modulus is not intended for children under the age of 13. We do not knowingly collect personal information from children.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">7. Changes to This Policy</h2>
      <p className="text-gray-500 mb-4">
        We may update this Privacy Policy from time to time. When we do, we will update the "Effective Date" at the top of this page.
      </p>

      <h2 className="font-bold text-lg mt-6 mb-2">8. Contact Us</h2>
      <p className="text-gray-500">
        If you have questions or concerns about this policy, reach out to:
      </p>
      <p className="text-gray-500 mt-2">
        <strong>Modulus Team</strong><br />
        Email: modulus@gmail.com<br />
        Website: themodulus.org
      </p>
    </div>
                </div>
        
        </div>
    </div>
     
    )



}