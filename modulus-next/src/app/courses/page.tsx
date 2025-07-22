
import Image from "next/image"

export default function CourseSelector() {

  return (
    <main className="p-8 bg-gray-200 w-screen h-screen">

        <h1 className="text-3xl font-bold font-[Inter]">Select your course</h1>
        <div className="bg-white rounded-2xl h-11/12 font-[Inter]">
          <div className="flex items-center ">
            <div className="grid grid-cols-3 w-screen mt-12 mx-5 place-items-center">
              <a href="">
              <div className="w-md h-72 border-1  border-gray-200 rounded-2xl flex flex-col drop-shadow-xl">
                  <div className="w-full rounded-2xl h-10/12 ">
                  <div className="relative w-full h-full drop">
                    <Image src="/images/courseBanner.PNG" fill priority alt="calculus emoji banner" className="rounded-2xl"></Image>
                    </div>
                  </div>
                  <div className="font-semibold text-2xl my-2 mx-3">Calculus 1</div>
              </div>
              </a>
              <div className="w-md h-72 border-1 border-gray-200 rounded-2xl"></div>
              <div className="w-md h-72 border-1 border-gray-200 rounded-2xl"></div>
              
            </div>
          </div>
        </div>
    </main>
  );
}
