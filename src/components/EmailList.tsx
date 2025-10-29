import EmailCard from "./EmailCard";

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  category: string;
}

interface EmailListProps {
  emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No emails to display</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "Fetch & Classify Emails" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}