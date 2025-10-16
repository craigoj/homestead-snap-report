import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WaitlistConfirmationEmailProps {
  firstName: string;
  position: number;
  priorityTier: string;
  email: string;
}

export const WaitlistConfirmationEmail = ({
  firstName,
  position,
  priorityTier,
  email,
}: WaitlistConfirmationEmailProps) => {
  const priorityLabels: Record<string, string> = {
    critical: 'Critical Priority',
    'high-risk': 'High Priority',
    moderate: 'Standard Priority',
    prepared: 'Early Access',
  };

  const priorityColors: Record<string, string> = {
    critical: '#dc2626',
    'high-risk': '#ea580c',
    moderate: '#ca8a04',
    prepared: '#16a34a',
  };

  const priorityColor = priorityColors[priorityTier] || '#6366f1';
  const priorityLabel = priorityLabels[priorityTier] || 'Priority Access';

  return (
    <Html>
      <Head />
      <Preview>Welcome to SnapAsset AI - You're #{position} on the waitlist!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to SnapAsset AI! 🎉</Heading>
          
          <Text style={text}>
            Hi {firstName},
          </Text>

          <Text style={text}>
            You're officially on the waitlist for SnapAsset AI - the AI-powered 
            home asset documentation tool that completes your inventory in 10 minutes 
            instead of 40+ hours.
          </Text>

          <Section style={positionSection}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '16px', color: '#666', margin: '0 0 8px' }}>
                Your Waitlist Position
              </Text>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: priorityColor,
                lineHeight: '1',
                marginBottom: '12px'
              }}>
                #{position}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                backgroundColor: priorityColor,
                color: '#ffffff',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {priorityLabel}
              </div>
            </div>
          </Section>

          <Heading style={h2}>What Happens Next?</Heading>

          <Section style={stepSection}>
            <Text style={stepTitle}>1️⃣ We're Building for You</Text>
            <Text style={stepText}>
              Our team is hard at work perfecting the AI technology that will make 
              home inventory effortless.
            </Text>
          </Section>

          <Section style={stepSection}>
            <Text style={stepTitle}>2️⃣ Early Access Invitation</Text>
            <Text style={stepText}>
              You'll be among the first to try SnapAsset AI when we launch. 
              {priorityTier === 'critical' || priorityTier === 'high-risk' 
                ? ' Based on your assessment, you\'ll get priority access.'
                : ' We\'ll notify you when it\'s your turn.'}
            </Text>
          </Section>

          <Section style={stepSection}>
            <Text style={stepTitle}>3️⃣ Exclusive Founder Benefits</Text>
            <Text style={stepText}>
              60-day free trial, priority support, and founding member pricing 
              when you sign up at launch.
            </Text>
          </Section>

          <Section style={stepSection}>
            <Text style={stepTitle}>4️⃣ Move Up the List</Text>
            <Text style={stepText}>
              Share SnapAsset AI with friends who need it. For every referral who 
              joins, you both move up 5 spots!
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button
              href={`https://snapasset.ai/waitlist?email=${encodeURIComponent(email)}`}
              style={{
                ...button,
                backgroundColor: '#6366f1',
                color: '#ffffff',
              }}
            >
              Share & Move Up the List
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={benefitSection}>
            <Heading style={h3}>Your Founding Member Benefits:</Heading>
            <Text style={benefitText}>✅ 60-day free trial (worth $99)</Text>
            <Text style={benefitText}>✅ Priority onboarding support</Text>
            <Text style={benefitText}>✅ Lifetime 30% founder discount</Text>
            <Text style={benefitText}>✅ Direct line to our product team</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            SnapAsset AI - AI-powered home asset documentation
            <br />
            Questions? Just reply to this email - we read every message.
          </Text>

          <Text style={{ ...footer, fontSize: '12px', marginTop: '16px' }}>
            Want to leave the waitlist? <Link href="#" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  padding: '0',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 20px',
  padding: '0',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const positionSection = {
  margin: '32px 0',
  padding: '32px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '2px solid #e2e8f0',
};

const stepSection = {
  margin: '16px 0',
  padding: '16px 0',
};

const stepTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const stepText = {
  fontSize: '15px',
  color: '#555555',
  lineHeight: '24px',
  margin: '0',
};

const ctaSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  display: 'inline-block',
  padding: '16px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const benefitSection = {
  padding: '24px',
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  border: '2px solid #bae6fd',
};

const benefitText = {
  fontSize: '16px',
  color: '#0c4a6e',
  lineHeight: '32px',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0',
};

const link = {
  color: '#6366f1',
  textDecoration: 'underline',
};
