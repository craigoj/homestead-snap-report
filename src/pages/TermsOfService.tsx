import React from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service | SnapAsset AI"
        description="Read the terms and conditions for using SnapAsset AI's home asset documentation platform."
        canonicalUrl="/terms-of-service"
        noIndex
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <Card>
              <CardContent className="p-8 space-y-6 prose prose-slate max-w-none dark:prose-invert">
                <section>
                  <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using SnapAsset AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                    If you do not agree to these Terms, do not use our Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">2. Description of Service</h2>
                  <p>
                    SnapAsset AI provides an AI-powered platform for documenting, organizing, and managing home assets for insurance purposes. 
                    Our Service includes:
                  </p>
                  <ul>
                    <li>Asset documentation and photo storage</li>
                    <li>OCR and barcode scanning for automated data extraction</li>
                    <li>Insurance preparedness assessments</li>
                    <li>Report generation for insurance claims</li>
                    <li>Property and room organization tools</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">3. User Accounts</h2>
                  <h3 className="text-xl font-semibold mt-4">3.1 Account Creation</h3>
                  <p>
                    You must create an account to use certain features. You agree to provide accurate, current, and complete information 
                    during registration and to update it as necessary.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-4">3.2 Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. 
                    Notify us immediately of any unauthorized use.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">3.3 Age Requirement</h3>
                  <p>
                    You must be at least 18 years old to use our Service. By using the Service, you represent that you meet this requirement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">4. User Content and Data</h2>
                  <h3 className="text-xl font-semibold mt-4">4.1 Your Content</h3>
                  <p>
                    You retain ownership of all content you upload ("User Content"), including photos, descriptions, and asset information. 
                    By uploading User Content, you grant us a license to use, store, process, and display it to provide the Service.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">4.2 Content Accuracy</h3>
                  <p>
                    You are solely responsible for the accuracy and legality of your User Content. You represent that you have the right 
                    to upload all content and that it does not violate any laws or third-party rights.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">4.3 Prohibited Content</h3>
                  <p>You may not upload content that:</p>
                  <ul>
                    <li>Is illegal, harmful, threatening, or harassing</li>
                    <li>Infringes intellectual property rights</li>
                    <li>Contains viruses or malicious code</li>
                    <li>Violates privacy rights of others</li>
                    <li>Is fraudulent or misleading</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">5. Acceptable Use</h2>
                  <p>You agree not to:</p>
                  <ul>
                    <li>Use the Service for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Use automated tools to access the Service without permission</li>
                    <li>Resell or commercially exploit the Service without authorization</li>
                    <li>Impersonate others or misrepresent your affiliation</li>
                    <li>Collect user information without consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">6. Pricing and Payment</h2>
                  <h3 className="text-xl font-semibold mt-4">6.1 Subscription Plans</h3>
                  <p>
                    We offer various subscription plans with different features and pricing. Current pricing is available on our website.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">6.2 Payment Terms</h3>
                  <p>
                    By providing payment information, you authorize us to charge the applicable fees. Payments are non-refundable except 
                    as required by law or as specified in our refund policy.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">6.3 Price Changes</h3>
                  <p>
                    We may change our pricing with 30 days' notice. Changes will apply to the next billing cycle after notice is provided.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">6.4 Cancellation</h3>
                  <p>
                    You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">7. Service Availability and Modifications</h2>
                  <p>
                    We strive to provide reliable service but do not guarantee uninterrupted access. We reserve the right to modify, 
                    suspend, or discontinue any part of the Service at any time with reasonable notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">8. Intellectual Property</h2>
                  <h3 className="text-xl font-semibold mt-4">8.1 Our Rights</h3>
                  <p>
                    The Service, including its software, design, text, graphics, and logos, is owned by SnapAsset AI and protected by 
                    intellectual property laws. You may not copy, modify, or distribute our intellectual property without permission.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">8.2 Feedback</h3>
                  <p>
                    Any feedback or suggestions you provide may be used by us without obligation to you.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">9. Disclaimer of Warranties</h2>
                  <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, 
                    INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    <strong>Important:</strong> SnapAsset AI is a documentation tool, not an insurance service. We do not provide insurance advice, 
                    valuations, or guarantees regarding insurance claims. Consult with insurance professionals for specific advice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">10. Limitation of Liability</h2>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SNAPASSET AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                    CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
                    OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                  <p>
                    OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">11. Indemnification</h2>
                  <p>
                    You agree to indemnify and hold harmless SnapAsset AI from any claims, damages, liabilities, and expenses 
                    (including legal fees) arising from your use of the Service, your User Content, or your violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">12. Termination</h2>
                  <p>
                    We may terminate or suspend your account and access to the Service at our discretion, without notice, for conduct 
                    that violates these Terms or is harmful to other users, us, or third parties.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will cease immediately. We may delete your User Content, 
                    though we will provide reasonable opportunity to export your data.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">13. Dispute Resolution</h2>
                  <h3 className="text-xl font-semibold mt-4">13.1 Governing Law</h3>
                  <p>
                    These Terms are governed by the laws of the State of California, without regard to conflict of law principles.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">13.2 Arbitration</h3>
                  <p>
                    Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with 
                    the American Arbitration Association rules, except where prohibited by law.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">13.3 Class Action Waiver</h3>
                  <p>
                    You agree that disputes will be resolved individually and not as part of a class action or consolidated proceeding.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">14. Changes to Terms</h2>
                  <p>
                    We may modify these Terms at any time. We will notify you of material changes via email or through the Service. 
                    Continued use after changes constitutes acceptance of the modified Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">15. Miscellaneous</h2>
                  <h3 className="text-xl font-semibold mt-4">15.1 Entire Agreement</h3>
                  <p>
                    These Terms, along with our Privacy Policy, constitute the entire agreement between you and SnapAsset AI.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">15.2 Severability</h3>
                  <p>
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">15.3 Waiver</h3>
                  <p>
                    Failure to enforce any provision does not constitute a waiver of that provision.
                  </p>

                  <h3 className="text-xl font-semibold mt-4">15.4 Assignment</h3>
                  <p>
                    You may not assign these Terms without our consent. We may assign these Terms without restriction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold">16. Contact Information</h2>
                  <p>
                    For questions about these Terms, contact us at:
                  </p>
                  <p>
                    <strong>SnapAsset AI</strong><br />
                    Email: legal@snapasset.ai<br />
                    Address: 123 Tech Street, San Francisco, CA 94105
                  </p>
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

export default TermsOfService;
