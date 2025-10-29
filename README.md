# 📧 AI Email Classifier

> **Hey there!** Tired of drowning in emails? This app uses AI to automatically sort your Gmail inbox into categories. Built as part of the MagicSlides.app internship assignment.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=flat-square&logo=openai)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

---

## What's This About?

You know that feeling when you open Gmail and see 200+ unread emails? Yeah, me too. This project helps with that.

It connects to your Gmail, fetches your recent emails, and uses GPT-3.5 to automatically categorize them into:
- **Important** stuff (meetings, work emails, deadlines)
- **Promotions** (all those "50% off!" emails)
- **Social** (LinkedIn, Facebook, Twitter notifications)
- **Marketing** (newsletters you forgot you subscribed to)
- **Spam** (you know what this is)
- **General** (everything else)

No database needed - everything stays in your browser's localStorage. Your emails, your rules.

---

## Quick Demo

1. Sign in with Google
2. Enter your OpenAI API key
3. Choose how many emails to fetch (1-100)
4. Click "Fetch & Classify"
5. Watch AI sort your emails in real-time!

---

## What I Built This With

- **Next.js 16** - Because it's awesome for full-stack apps
- **TypeScript** - Type safety is my friend
- **Tailwind CSS 4** - Made styling actually enjoyable
- **NextAuth.js** - Handles all the OAuth headaches
- **Gmail API** - To fetch your emails
- **OpenAI GPT-3.5** - The AI brain doing the classification

---

## Getting Started

### What You'll Need

Before we start, make sure you have:

- Node.js (v20 or higher) - [Download here](https://nodejs.org/)
- A Gmail account (obviously)
- A Google Cloud account (free tier works)
- An OpenAI account with some credits (~$5 should last you forever)

### Step 1: Clone This Thing

```bash
git clone https://github.com/yourusername/email-classifier.git
cd email-classifier
npm install
```

### Step 2: Set Up Google OAuth

This is the annoying part, but I'll walk you through it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (call it whatever you want)
3. Enable the Gmail API:
   - Click "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Hit that Enable button

4. Create OAuth credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add this to authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```

5. Add test users (important!):
   - Go to "OAuth consent screen"
   - Add `theindianappguy@gmail.com` (required for the assignment)
   - Add your own email too

6. Copy your Client ID and Client Secret - you'll need them next

### Step 3: Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command_to_generate_openssl_rand_base64_32
```

To generate the `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### Step 4: Get Your OpenAI API Key

1. Head to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. **Important**: Add at least $5 in credits (the app will ask you for this key when you use it)

### Step 5: Run It!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the login page!

---

## How to Use It

1. **Sign in** with your Google account
2. You'll see a modal asking for your **OpenAI API key** - paste it there
   - Don't worry, it's only stored in your browser
   - The app never sends it to any server except OpenAI
3. Choose how many emails you want to fetch (default is 15)
4. Hit **"Fetch & Classify Emails"**
5. Watch the magic happen! ✨
6. Use the filter buttons to view emails by category

---

## Project Structure

Here's what's inside:

```
email-classifier/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts    # Google OAuth setup
│   │   │   └── emails/
│   │   │       ├── fetch/route.ts             # Grabs emails from Gmail
│   │   │       └── classify/route.ts          # Sends to GPT for sorting
│   │   ├── dashboard/page.tsx                 # Main UI where magic happens
│   │   ├── page.tsx                           # Landing page
│   │   └── globals.css                        # Styling
│   ├── components/
│   │   ├── EmailList.tsx                      # Shows all your emails
│   │   ├── EmailCard.tsx                      # Individual email display
│   │   └── OpenAiKeyModal.tsx                 # Where you enter API key
│   ├── lib/
│   │   ├── gmail.ts                           # Gmail API logic
│   │   ├── langchain.ts                       # OpenAI classification
│   │   └── types.ts                           # TypeScript types
│   └── types/
│       └── next-auth.d.ts                     # Auth type definitions
├── .env.local                                  # Your secrets (don't commit!)
├── package.json
└── README.md                                   # You are here 📍
```

---

## Common Issues (and How to Fix Them)

### "Unauthorized" Error

**Problem**: App can't access your emails  
**Fix**: 
- Sign out and sign back in
- Make sure Gmail API is enabled in Google Cloud Console
- Check that your redirect URI is exactly `http://localhost:3000/api/auth/callback/google`

### "Missing Credentials" Error

**Problem**: App can't find your Google OAuth keys  
**Fix**: 
- Double-check your `.env.local` file exists
- Make sure all variables are filled in
- Restart the dev server (`Ctrl+C` then `npm run dev`)

### "429 Quota Exceeded" Error

**Problem**: You ran out of OpenAI credits  
**Fix**: 
- Go to [OpenAI Billing](https://platform.openai.com/settings/organization/billing/overview)
- Add $5+ in credits
- Wait a few minutes, then try again

### Everything Gets Classified as "General"

**Problem**: Something's wrong with the AI classification  
**Fix**: 
- Check the terminal - look for error messages
- Verify your OpenAI API key is correct
- Make sure you have credits available
- Try refreshing the page and re-entering the API key

### Hydration Error in Console

**Problem**: React hydration warning  
**Fix**: 
- This is usually caused by browser extensions
- Safe to ignore, or disable extensions temporarily
- The app still works fine!

---

## API Endpoints

### Fetch Emails
```
GET /api/emails/fetch?count=15
```
Returns your recent emails from Gmail.

**Parameters:**
- `count` (optional): Number of emails (1-100, default: 15)

**Response:**
```json
{
  "emails": [
    {
      "id": "abc123",
      "subject": "Meeting tomorrow",
      "from": "boss@company.com",
      "date": "2025-10-29",
      "snippet": "Don't forget about our meeting..."
    }
  ]
}
```

### Classify Emails
```
POST /api/emails/classify
```

**Body:**
```json
{
  "emails": [...],
  "openAiKey": "sk-proj-..."
}
```

**Response:**
```json
{
  "emails": [
    {
      "id": "abc123",
      "subject": "Meeting tomorrow",
      "category": "Important",
      ...
    }
  ]
}
```

---

## Deployment

Want to deploy this? Here's how:

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repo
3. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your actual domain, like `https://yourapp.vercel.app`)
   - `NEXTAUTH_SECRET`
4. In Google Cloud Console, add your production URL to authorized redirect URIs:
   ```
   https://yourapp.vercel.app/api/auth/callback/google
   ```
5. Click Deploy!

### Other Platforms

The app works on any Node.js hosting platform:
- **Netlify**: Similar to Vercel
- **Railway**: Great for full-stack apps
- **Render**: Free tier available
- **Your own VPS**: Run `npm run build && npm start`

---

## What I Learned Building This

- Google OAuth is more complicated than it looks
- NextAuth.js is a lifesaver for authentication
- GPT-3.5 is surprisingly good at understanding email context
- Tailwind CSS v4 is chef's kiss 👌
- Error handling is 80% of the work
- Reading documentation saves hours of debugging
- Always restart the dev server after changing `.env.local`

---

## Future Improvements

If I had more time, I'd add:
- [ ] Dark mode (because why not)
- [ ] Export emails to CSV
- [ ] Custom categories you can define
- [ ] Email analytics dashboard
- [ ] Support for Outlook/Yahoo emails
- [ ] Bulk actions (archive, delete, etc.)
- [ ] Mobile responsive design improvements
- [ ] Email search functionality
- [ ] Better error messages in the UI

---

## Contributing

Found a bug? Want to add a feature? PRs are welcome!

1. Fork it
2. Create your feature branch (`git checkout -b cool-new-feature`)
3. Commit your changes (`git commit -m 'Add some cool feature'`)
4. Push to the branch (`git push origin cool-new-feature`)
5. Open a Pull Request

---

## A Note on Privacy

Your emails are only:
- Fetched when you click the button
- Stored in your browser's localStorage
- Never sent to any server except Gmail (to fetch) and OpenAI (to classify)
- Never stored in any database
- Can be cleared anytime by clearing your browser data

Your OpenAI API key is:
- Stored only in your browser's localStorage
- Never sent to any server except OpenAI directly
- Can be deleted anytime by clearing your browser data
- Not visible in network requests to our API routes

---

## Cost Breakdown

Let's talk money:

- **Google Cloud**: Free (using Gmail API free tier)
- **Next.js/Vercel**: Free tier is plenty for personal use
- **OpenAI GPT-3.5 Turbo**: ~$0.002 per classification
  - Classifying 50 emails ≈ $0.10
  - $5 = ~2,500 email classifications

So basically, $5 will last you a really long time unless you're processing thousands of emails daily.

---

## Assignment Details

This project was built for the **MagicSlides.app Full-Stack Engineer Intern Assignment**.

**Requirements Met:**
- ✅ Google OAuth authentication
- ✅ Gmail API integration
- ✅ OpenAI GPT-4o/3.5 classification
- ✅ Next.js frontend with Tailwind CSS
- ✅ Next.js API routes backend
- ✅ Langchain.js integration
- ✅ localStorage for emails and API key
- ✅ Dynamic email count (1-100)
- ✅ Category filtering
- ✅ Clean, documented code
- ✅ Test user added: theindianappguy@gmail.com

---

## Credits

Built by [Your Name] for the MagicSlides.app internship assignment.

**Tech Credits:**
- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - AI classification
- [Google Gmail API](https://developers.google.com/gmail/api) - Email fetching
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling

**Special Thanks:**
- The Next.js team for amazing documentation
- OpenAI for making AI accessible
- The countless Stack Overflow answers that saved me
- Coffee ☕

---

## Contact

Questions? Found a bug? Just want to chat about the project?

- **Email**: singhaditya4333@gmai.com
- **GitHub**: [@yourusername](https://github.com/Adityas3111N)
- **LinkedIn**: [Your Name](https://www.linkedin.com/in/aditya-singh-0a7181349/)
- **Twitter**: [@yourhandle](https://x.com/singhaditya4333)

---

## License

MIT License - Feel free to use this code however you want!

```
MIT License

Copyright (c) 2025 [Aditya Singh]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**If this helped you, consider giving it a ⭐**

Made with ☕ and a lot of Stack Overflow

[Report Bug](https://github.com/yourusername/email-classifier/issues) · [Request Feature](https://github.com/yourusername/email-classifier/issues)

</div>
