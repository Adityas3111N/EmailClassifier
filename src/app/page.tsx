"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Email Classifier
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Classify your Gmail emails using AI
        </p>
        
        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Google icon SVG path */}
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}