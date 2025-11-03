'use client'

import React from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | SnapAsset AI"
        description="Learn how SnapAsset AI collects, uses, and protects your personal information."
        canonicalUrl="/privacy-policy"
        noIndex
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <Card>
              <CardContent className="p-8 space-y-6 prose prose-slate max-w-none dark:prose-invert">
                <section>
                  <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                  <p>
                    SnapAsset AI ("we," "our," or "us") collects information that you provide directly to us, including:
                  </p>
                  <ul>
                    <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                    <li><strong>Account Information:</strong> Username, password, and profile details</li>
                    <li><strong>Asset Information:</strong> Photos, descriptions, values, and metadata about your personal property</li>
                    <li><strong>Assessment Data:</strong> Responses to our insurance preparedness quiz</li>
                    <li><strong>Usage Information:</strong> How you interact with our service, including IP address, browser type, and device information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your asset documentation and generate reports</li>
                    <li>Send you assessment results and personalized recommendations</li>
                    <li>Communicate with you about product updates, offers, and promotions</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Detect, prevent, and address technical issues or fraudulent activity</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">3. Information Sharing and Disclosure</h2>
                  <p>
                    We do not sell your personal information. We may share your information only in the following circumstances:
                  </p>
                  <ul>
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                    <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., email delivery, cloud storage)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">4. Data Security</h2>
                  <p>
                    We implement industry-standard security measures to protect your information, including:
                  </p>
                  <ul>
                    <li>Encrypted data transmission (SSL/TLS)</li>
                    <li>Secure cloud storage with access controls</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p>
                    However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information,
                    we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">5. Your Rights and Choices</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at privacy@snapasset.ai
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">6. Cookies and Tracking Technologies</h2>
                  <p>
                    We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content.
                    You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">7. Data Retention</h2>
                  <p>
                    We retain your information for as long as necessary to provide our services and comply with legal obligations.
                    When you delete your account, we will delete or anonymize your personal information within 30 days,
                    except where required by law to retain it longer.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">8. Children's Privacy</h2>
                  <p>
                    Our service is not intended for children under 13. We do not knowingly collect personal information from children.
                    If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">9. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to and processed in countries other than your own.
                    We ensure appropriate safeguards are in place for international transfers.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">10. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of significant changes by email or
                    through a notice on our website. Your continued use of our service after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">11. Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy or our privacy practices, contact us at:
                  </p>
                  <p>
                    <strong>SnapAsset AI</strong><br />
                    Email: privacy@snapasset.ai<br />
                    Address: 123 Tech Street, San Francisco, CA 94105
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">12. State-Specific Rights</h2>
                  <h3 className="text-xl font-semibold mt-4">California Residents (CCPA)</h3>
                  <p>California residents have additional rights under the California Consumer Privacy Act (CCPA), including:</p>
                  <ul>
                    <li>Right to know what personal information is collected</li>
                    <li>Right to know if personal information is sold or disclosed</li>
                    <li>Right to opt-out of the sale of personal information</li>
                    <li>Right to deletion</li>
                    <li>Right to non-discrimination for exercising CCPA rights</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-4">European Residents (GDPR)</h3>
                  <p>If you are in the European Economic Area, you have rights under the General Data Protection Regulation (GDPR), including:</p>
                  <ul>
                    <li>Right to access, rectification, and erasure</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right to withdraw consent</li>
                    <li>Right to lodge a complaint with a supervisory authority</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
