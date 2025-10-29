import { google } from "googleapis";

export async function fetchGmailEmails(accessToken: string, maxResults: number = 15) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // Fetch message list
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  const messages = listResponse.data.messages || [];

  // Fetch full message details
  const emails = await Promise.all(
    messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "full",
      });

      const headers = msg.data.payload?.headers || [];
      const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const from = headers.find((h) => h.name === "From")?.value || "Unknown";
      const date = headers.find((h) => h.name === "Date")?.value || "";

      // Get email body
      let body = "";
      if (msg.data.payload?.parts) {
        const textPart = msg.data.payload.parts.find(
          (part) => part.mimeType === "text/plain"
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        }
      } else if (msg.data.payload?.body?.data) {
        body = Buffer.from(msg.data.payload.body.data, "base64").toString("utf-8");
      }

      return {
        id: message.id,
        subject,
        from,
        date,
        body: body.substring(0, 500), // Limit body length
        snippet: msg.data.snippet || "",
      };
    })
  );

  return emails;
}