import OpenAI from "openai";

// ✅ Initialize OpenRouter client once
const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://email-classifier-blue.vercel.app", 
    "X-Title": "Email Classifier",
  },
});

/**
 * Classify a single email into: Important, Promotions, Social, Marketing, Spam, or General
 */
/**
 * Classifies a single email into a category using AI
 * Returns one of: Important, Promotions, Social, Marketing, Spam, or General
 */
/**
 * Classifies a single email into a category using AI
 * Returns one of: Important, Promotions, Social, Marketing, Spam, or General
 */
export async function classifyEmail(
  email: { subject: string; from: string; body: string; snippet: string },
  apiKey: string
) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Email Classifier",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an expert email classifier. Classify each email into EXACTLY ONE category.

IMPORTANT - Work/professional emails requiring attention:
• Project updates, deadlines, meeting invites
• Messages from colleagues, managers, clients
• Job offers, interview schedules, recruiters
• Deployment failures, bug alerts, urgent tasks
• Financial: invoices, bills, payment confirmations
• Health/Medical: appointments, prescriptions, lab results
• Government/Legal: tax notices, renewals, official documents
Keywords: deadline, urgent, meeting, invoice, appointment, notice

PROMOTIONS - Sales and marketing offers:
• Discounts, deals, flash sales, limited-time offers
• "50% off", "buy now", "exclusive deal", "free shipping"
• E-commerce: order confirmations, shipping updates, cart reminders
Keywords: sale, discount, deal, off, shop now, order, shipped

SOCIAL - Social media and networking notifications:
• LinkedIn, Facebook, Twitter, Instagram, GitHub notifications
• Friend requests, comments, likes, endorsements
• Profile views, connection requests
Keywords: commented, liked, friend request, connection, endorsed

MARKETING - Informational content and newsletters:
• Company newsletters, blog updates, weekly digests
• Product announcements, release notes
• Educational content, course updates
• Travel confirmations, itineraries, bookings
Keywords: newsletter, weekly, digest, update, unsubscribe

SPAM - Unsolicited or suspicious emails:
• Phishing attempts, lottery wins, suspicious offers
• Unknown senders with urgent demands
• "You won", "claim prize", "click here", poor grammar
Keywords: congratulations, winner, claim, verify account, suspicious

GENERAL - Everything else:
• Automated notifications, system messages
• Receipts, confirmations, password resets
• Low-priority transactional emails
Keywords: noreply, automated, notification, confirmation

OUTPUT FORMAT: Respond with ONLY ONE WORD from: Important, Promotions, Social, Marketing, Spam, General`
          },
          // Few-shot examples
          {
            role: "user",
            content: `From: manager@company.com
Subject: URGENT: Project deadline moved to tomorrow
Preview: Team, due to client requirements, we need to deliver the project by tomorrow 5 PM.

Category:`
          },
          {
            role: "assistant",
            content: "Important"
          },
          {
            role: "user",
            content: `From: deals@amazon.com
Subject: Flash Sale: 50% OFF Electronics - Today Only!
Preview: Limited time offer! Get 50% off on laptops. Use code FLASH50. Free shipping!

Category:`
          },
          {
            role: "assistant",
            content: "Promotions"
          },
          {
            role: "user",
            content: `From: notifications@linkedin.com
Subject: Sarah Johnson endorsed you for JavaScript
Preview: Sarah Johnson and 5 others endorsed your skills. View your profile to see endorsements.

Category:`
          },
          {
            role: "assistant",
            content: "Social"
          },
          {
            role: "user",
            content: `From: newsletter@medium.com
Subject: Your Weekly Reading List - AI Trends
Preview: Here are this week's top stories about artificial intelligence and machine learning.

Category:`
          },
          {
            role: "assistant",
            content: "Marketing"
          },
          {
            role: "user",
            content: `From: winner@lottery-claim.biz
Subject: URGENT!!! You Won $1,000,000 - Claim NOW
Preview: Congratulations! Click this link immediately to claim your prize before expires.

Category:`
          },
          {
            role: "assistant",
            content: "Spam"
          },
          {
            role: "user",
            content: `From: noreply@github.com
Subject: Issue #12345 was closed
Preview: Your issue in repository example/project has been closed by the maintainer.

Category:`
          },
          {
            role: "assistant",
            content: "General"
          },
          // Actual email to classify
          {
            role: "user",
            content: `From: ${email.from}
Subject: ${email.subject}
Preview: ${email.snippet || email.body.substring(0, 300)}

Category:`
          }
        ],
        temperature: 0.6,
        max_tokens: 10,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenRouter error ${response.status}:`, errorText);
      return "General";
    }

    const aiResponse = await response.json();
    let aiAnswer = aiResponse.choices[0].message.content?.trim() || "General";
    
    console.log(`🤖 AI said: "${aiAnswer}" for email: "${email.subject.substring(0, 40)}..."`);
    
    // Clean up the answer
    const cleanAnswer = aiAnswer.replace(/[^a-zA-Z]/g, '').trim();
    
    // Validate category
    const validCategories = ['Important', 'Promotions', 'Social', 'Marketing', 'Spam', 'General'];
    const matchedCategory = validCategories.find(
      category => category.toLowerCase() === cleanAnswer.toLowerCase()
    );
    
    const finalCategory = matchedCategory || 'General'; // FIXED: was 'kuch nahi'
    
    console.log(`✅ Final category: ${finalCategory}`);
    
    return finalCategory;
    
  } catch (error: any) {
    console.error('❌ Classification failed:', error.message);
    return 'General';
  }
}

/**
 * Classifies multiple emails one by one
 */
/**
 * Classifies multiple emails one by one
 * Shows progress as it goes
 */
export async function classifyEmails(emails: any[], apiKey: string) {
  console.log(`\n🚀 Classifying ${emails.length} emails...\n`);
  
  const classifiedEmails = [];
  
  // Go through each email one by one
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const emailNumber = i + 1;
    const totalEmails = emails.length;
    
    try {
      // Classify this email
      const category = await classifyEmail(email, apiKey);
      
      console.log(`📧 [${emailNumber}/${totalEmails}] "${email.subject.substring(0, 40)}..." → ${category}`);
      
      // Add the category to the email
      classifiedEmails.push({ 
        ...email, 
        category 
      });
      
      // Small pause to avoid overwhelming the API
      if (emailNumber < totalEmails) {
        await new Promise(wait => setTimeout(wait, 500));
      }
      
    } catch (error: any) {
      // If this email fails, just mark it as General and continue
      console.error(`❌ Email ${emailNumber} failed:`, error.message);
      classifiedEmails.push({ 
        ...email, 
        category: "General" 
      });
    }
  }
  
  // Show a summary of what we found
  const summary: Record<string, number> = {}; // FIX: Add proper type annotation
  classifiedEmails.forEach(email => {
    const cat = email.category;
    summary[cat] = (summary[cat] || 0) + 1;
  });
  
  console.log('\n📊 Summary:', summary);
  console.log('');
  
  return classifiedEmails;
}