"use client";

import { useState } from "react";

interface OpenAIKeyModalProps {
  currentKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

export default function OpenAIKeyModal({
  currentKey,
  onSave,
  onClose,
}: OpenAIKeyModalProps) {
  const [key, setKey] = useState(currentKey);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    } else {
      alert("Please enter a valid OpenAI API key");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          OpenAI API Key
        </h2>
        
        <p className="text-gray-600 text-sm mb-4">
          Enter your OpenAI API key to classify emails. Your key is stored locally
          and never sent to our servers.
        </p>

        <div className="mb-6">
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">
            Get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
          >
            Save
          </button>
          {currentKey && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}