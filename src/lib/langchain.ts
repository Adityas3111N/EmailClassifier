import OpenAI from "openai";

export async function classifyEmail(
  email: { subject: string; from: string; body: string; snippet: string },
  openAiKey: string
) {
  try {
    console.log(`🔑 Using OpenRouter API key: ${openAiKey.substring(0, 10)}...`);
    
    const openai = new OpenAI({ 
      apiKey: openAiKey,
      baseURL: "https://openrouter.ai/api/v1",  // 👈 ONLY CHANGE!
      dangerouslyAllowBrowser: false,
    });

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",  // 👈 FREE MODEL!
      // Alternative free models:
      // "mistralai/mistral-7b-instruct:free"
      // "google/gemma-7b-it:free"
      // "nousresearch/hermes-3-llama-3.1-405b:free"
      
      messages: [{
        role: "system",
        content: "You are an email classifier. Respond with ONLY one word: Important, Promotions, Social, Marketing, Spam, or General. No explanations."
      }, {
        role: "user",
        content: `From: ${email.from}\nSubject: ${email.subject}\nPreview: ${email.snippet || email.body.substring(0, 200)}\n\nCategory:`
      }],
      temperature: 0,
      max_tokens: 10,
    });

    let category = response.choices[0].message.content?.trim() || "General";
    
    console.log(`🔍 RAW: "${category}" | "${email.subject.substring(0, 40)}"`);
    
    // Clean and validate
    category = category.replace(/[^a-zA-Z]/g, '');
    const validCategories = ['Important', 'Promotions', 'Social', 'Marketing', 'Spam', 'General'];
    const matched = validCategories.find(v => v.toLowerCase() === category.toLowerCase());
    
    const final = matched || 'General';
    console.log(`📧 "${email.subject.substring(0, 40)}..." → ${final}`);
    
    return final;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return 'General';
  }
}

export async function classifyEmails(emails: any[], openAiKey: string) {
  console.log(`\n🤖 Starting classification of ${emails.length} emails with OpenRouter...\n`);
  
  const results = [];
  
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    try {
      const category = await classifyEmail(email, openAiKey);
      console.log(`✅ [${i + 1}/${emails.length}] ${category}`);
      results.push({ ...email, category });
      
      // Small delay to avoid rate limits
      if (i < emails.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (error: any) {
      console.error(`❌ [${i + 1}/${emails.length}] Error:`, error.message);
      results.push({ ...email, category: "General" });
    }
  }
  
  const summary = results.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 Summary:', summary, '\n');
  
  return results;
}