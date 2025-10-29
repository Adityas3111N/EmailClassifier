interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  category: string;
}

interface EmailCardProps {
  email: Email;
}

const categoryColors: Record<string, string> = {
  Important: "bg-red-100 text-red-800 border-red-300",
  Promotions: "bg-purple-100 text-purple-800 border-purple-300",
  Social: "bg-blue-100 text-blue-800 border-blue-300",
  Marketing: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Spam: "bg-gray-100 text-gray-800 border-gray-300",
  General: "bg-green-100 text-green-800 border-green-300",
};

export default function EmailCard({ email }: EmailCardProps) {
  const categoryColor = categoryColors[email.category] || categoryColors.General;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {email.subject}
          </h3>
          <p className="text-sm text-gray-600">{email.from}</p>
        </div>
        <div className="ml-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor}`}
          >
            {email.category}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {email.snippet}
      </p>
      
      <div className="text-xs text-gray-500">
        {new Date(email.date).toLocaleString()}
      </div>
    </div>
  );
}