import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import sgMail from "npm:@sendgrid/mail@8.1.0";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    const { to, subject, html, from, text }: SendEmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Set SendGrid API key
    sgMail.setApiKey(SENDGRID_API_KEY);

    // Prepare email message
    const msg = {
      to: to,
      from: from || "noreply@yourdomain.com", // Change to your verified sender
      subject: subject,
      text: text || "",
      html: html,
    };

    console.log("Sending email to:", to);

    // Send email using SendGrid
    await sgMail.send(msg);

    console.log("Email sent successfully to:", to);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
