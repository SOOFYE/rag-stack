'use client'

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-[family-name:var(--font-geist-sans)]">



      <section className="text-center pt-28 pb-10 px-6">
        <h2 className="text-3xl md:text-6xl font-black mb-4 text-black">
          Chat with your documents.
        </h2>
        <p className="text-md text-black max-w-xl mx-auto">
          Dive into PDFs like never before with RAGSTACK. Let AI summarize long documents,
          explain complex concepts, and find key information in seconds.
        </p>
      </section>

      <section className="text-center mb-10">
        <Link href="/signup">
          <button className="cursor-pointer group bg-black hover:bg-[#383838] text-white px-6 py-3 rounded text-lg font-semibold">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 animate-pulse group-hover:animate-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
              Try for Free
            </div>
          </button>
        </Link>
      </section>

      <section className="text-center mb-10 px-6">
        <h4 className="text-lg font-semibold mb-4">Supported Formats</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {['PDF', 'DOC', 'DOCX', 'TXT'].map((format) => (
            <span key={format} className="bg-gray-200 hover:text-purple-900 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
              {format}
            </span>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">1. Upload Documents</h3>
          <p className="text-gray-600">Start by uploading your PDF, DOC, DOCX, or TXT files.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">2. Chat with AI</h3>
          <p className="text-gray-600">Ask questions and get intelligent, cited answers.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">3. Save Time</h3>
          <p className="text-gray-600">No more searching—get straight to the info you need.</p>
        </div>
      </section>




      <section className="text-center my-12">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold">
          Try for Free
        </button>
      </section>
    </div>
  );
}