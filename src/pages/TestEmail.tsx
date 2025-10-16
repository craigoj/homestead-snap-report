import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    from: "noreply@yourdomain.com",
    subject: "Test Email from SnapAsset AI",
    text: "This is a test email sent using SendGrid",
    html: "<strong>This is a test email sent using SendGrid</strong><p>If you're seeing this, SendGrid is working correctly!</p>",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Test email sent successfully!");
      console.log("Email response:", data);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test SendGrid Email</CardTitle>
            <CardDescription>
              Send a test email to verify your SendGrid configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To Email *</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from">From Email (Verified Sender) *</Label>
                <Input
                  id="from"
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={formData.from}
                  onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Must be a verified sender in your SendGrid account
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Email subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Plain Text Content</Label>
                <Textarea
                  id="text"
                  placeholder="Plain text version of your email"
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="html">HTML Content *</Label>
                <Textarea
                  id="html"
                  placeholder="<strong>HTML version of your email</strong>"
                  value={formData.html}
                  onChange={(e) =>
                    setFormData({ ...formData, html: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Test Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEmail;
