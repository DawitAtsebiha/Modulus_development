'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function signedReferralPage(){

    return(
        <div className='font-[Inter] w-screen h-screen bg-[#EEF1F9]'>
            <div className='flex flex-col justify-center items-center pt-20'>
            <div><h1 className='text-6xl font-bold'>modulus</h1>
            <div className='text-center font-semibold pb-12'>afilliate program</div></div>
            <div className='w-4/12 h-11/12 bg-white rounded-2xl flex flex-col'>
                <Image 
                              src="/visuals/SVGs/mod-logo.svg" 
                              alt="Modulus Logo" 
                              width={40}
                              height={40}
                              className='mx-auto pt-12'
                            />
                <div className='text-center font-medium pt-8 text-lg' >Invite your friends to use  your affiliate code on  <br />  signup  and enjoy a free month on us!</div>
                <hr className='w-10/12 h-0.5 mx-auto my-4 bg-gray-200 border-0 rounded-sm md:my-10 dark:bg-gray-700'/>
                <div className='flex flex-col '>
                    <div className='text-center text-xl font-semibold pt-24'>Affiliate Code</div>
                    <div className='text-center text-3xl font-bold pt-4'>x8sja7</div>

                    <div className='text-center text-xl font-semibold pt-24'>Users Referred</div>
                    <div className='text-center text-3xl font-bold pt-4 pb-20'>0</div>

                </div>
            
            </div>

            </div>
        </div>
    )

}