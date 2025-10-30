"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmailList from "@/components/EmailList";
import OpenAIKeyModal from "@/components/OpenAIKeyModal";
import { ClassifiedEmail } from "@/lib/types";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [emails, setEmails] = useState<ClassifiedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAiKey, setOpenAiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [emailCount, setEmailCount] = useState(15);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_key");
    if (savedKey && savedKey !== "undefined") {
      setOpenAiKey(savedKey);
    } else {
      setShowKeyModal(true);
    }

    const savedEmails = localStorage.getItem("classified_emails");
    if (savedEmails && savedEmails !== "undefined") {
      try {
        setEmails(JSON.parse(savedEmails));
      } catch (error) {
        console.error("Error parsing saved emails:", error);
        localStorage.removeItem("classified_emails");
      }
    }
  }, []);

  const handleSignOut = async () => {
    // Clear localStorage
    localStorage.removeItem("openai_key");
    localStorage.removeItem("classified_emails");
    
    // Reset state
    setEmails([]);
    setOpenAiKey("");
    
    // Sign out and go to home
    await signOut({ callbackUrl: "/" });
  };

  const fetchAndClassifyEmails = async () => {
    if (!openAiKey) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    try {
      const fetchRes = await fetch(`/api/emails/fetch?count=${emailCount}`);
      
      if (!fetchRes.ok) {
        const errorText = await fetchRes.text();
        console.error("Fetch failed:", errorText);
        throw new Error(`Failed to fetch emails: ${fetchRes.status}`);
      }
      
      const { emails: fetchedEmails } = await fetchRes.json();

      if (!fetchedEmails || fetchedEmails.length === 0) {
        alert("No emails found. Please check your Gmail connection.");
        setLoading(false);
        return;
      }

      const classifyRes = await fetch("/api/emails/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: fetchedEmails, openAiKey }),
      });

      if (!classifyRes.ok) {
        const errorText = await classifyRes.text();
        console.error("Classification failed:", errorText);
        throw new Error(`Failed to classify emails: ${classifyRes.status}`);
      }

      const { emails: classifiedEmails } = await classifyRes.json();

      setEmails(classifiedEmails);
      localStorage.setItem("classified_emails", JSON.stringify(classifiedEmails));
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to fetch or classify emails'}`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Important", "Promotions", "Social", "Marketing", "Spam", "General"];

  const filteredEmails = selectedCategory === "All"
    ? emails
    : emails.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
          >
            📧 Email Classifier
          </h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowKeyModal(true)}
              className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              ⚙️ API Key
            </button>
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-300 shadow-sm">
            <label htmlFor="email-count" className="text-sm font-medium text-gray-700">
              Number of emails:
            </label>
            <input
              id="email-count"
              type="number"
              min="1"
              max="100"
              value={emailCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 100) {
                  setEmailCount(value);
                }
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium"
            />
            <span className="text-xs text-gray-500">(max 100)</span>
          </div>

          <button
            onClick={fetchAndClassifyEmails}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Loading..." : `Fetch & Classify ${emailCount} Emails`}
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full cursor-pointer ${selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <EmailList emails={filteredEmails} />
      </main>

      {showKeyModal && (
        <OpenAIKeyModal
          currentKey={openAiKey}
          onSave={(key) => {
            setOpenAiKey(key);
            localStorage.setItem("openai_key", key);
            setShowKeyModal(false);
          }}
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </div>
  );
}