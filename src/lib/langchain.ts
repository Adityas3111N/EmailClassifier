import OpenAI from "openai";

/**
 * Classifies a single email into a category using AI
 * Returns one of: Important, Promotions, Social, Marketing, Spam, or General
 */
export async function classifyEmail(
  email: { subject: string; from: string; body: string; snippet: string },
  apiKey: string
) {
  try {
    // Set up connection to OpenRouter (free AI service)
    const ai = new OpenAI({ 
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      dangerouslyAllowBrowser: false,
    });

    // Ask AI to classify the email
    const aiResponse = await ai.chat.completions.create({
      model: "nvidia/nemotron-nano-12b-2-vl:free",
      messages: [
        {
          role: "system",
          content: "You are an email classifier. Respond with ONLY one word: Important, Promotions, Social, Marketing, Spam, or General."
        },
        {
          role: "user",
          content: `
            From: ${email.from}
            Subject: ${email.subject}
            Preview: ${email.snippet || email.body.substring(0, 200)}
            
            What category is this email?
          `
        }
      ],
      temperature: 0, // Make responses consistent
      max_tokens: 10, // We only need one word back
    });

    // Get the AI's answer
    let aiAnswer = aiResponse.choices[0].message.content?.trim() || "General";
    
    console.log(`🤖 AI said: "${aiAnswer}" for email: "${email.subject.substring(0, 40)}..."`);
    
    // Clean up the answer (remove punctuation, extra spaces, etc.)
    const cleanAnswer = aiAnswer.replace(/[^a-zA-Z]/g, '').trim();
    
    // Make sure it's a valid category
    const validCategories = ['Important', 'Promotions', 'Social', 'Marketing', 'Spam', 'General'];
    const matchedCategory = validCategories.find(
      category => category.toLowerCase() === cleanAnswer.toLowerCase()
    );
    
    // Use the matched category, or default to "General" if invalid
    const finalCategory = matchedCategory || 'General';
    
    console.log(`✅ Final category: ${finalCategory}`);
    
    return finalCategory;
    
  } catch (error: any) {
    // If something goes wrong, just mark it as General
    console.error(' Oops, classification failed:', error.message);
    return 'General';
  }
}

/**
 * Classifies multiple emails one by one
 * Shows progress as it goes
 */
export async function classifyEmails(emails: any[], apiKey: string) {
  console.log(`\n Let's classify ${emails.length} emails...\n`);
  
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
        await new Promise(wait => setTimeout(wait, 200));
      }
      
    } catch (error: any) {
      // If this email fails, just mark it as General and continue
      console.error(` Email ${emailNumber} failed:`, error.message);
      classifiedEmails.push({ 
        ...email, 
        category: "General" 
      });
    }
  }
  
  // Show a summary of what we found
  const summary = {};
  classifiedEmails.forEach(email => {
    const cat = email.category;
    summary[cat] = (summary[cat] || 0) + 1;
  });
  
  console.log('\n Results:');
  console.log(summary);
  console.log('');
  
  return classifiedEmails;
}