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

interface AssessmentResultsEmailProps {
  firstName: string;
  score: number;
  segment: string;
  insights: Array<{ title: string; description: string }>;
  resultsUrl: string;
}

export const AssessmentResultsEmail = ({
  firstName,
  score,
  segment,
  insights,
  resultsUrl,
}: AssessmentResultsEmailProps) => {
  const segmentLabels: Record<string, string> = {
    critical: 'CRITICAL RISK',
    'high-risk': 'HIGH RISK',
    moderate: 'MODERATE RISK',
    prepared: 'WELL PREPARED',
  };

  const segmentColors: Record<string, string> = {
    critical: '#dc2626',
    'high-risk': '#ea580c',
    moderate: '#ca8a04',
    prepared: '#16a34a',
  };

  const segmentColor = segmentColors[segment] || '#6366f1';
  const segmentLabel = segmentLabels[segment] || segment.toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Your Insurance Preparedness Score: {score}/100 - {segmentLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hi {firstName}! 👋</Heading>
          
          <Text style={text}>
            Thank you for completing the Insurance Preparedness Assessment. 
            Your results are ready!
          </Text>

          <Section style={scoreSection}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '64px', 
                fontWeight: 'bold', 
                color: segmentColor,
                lineHeight: '1',
                marginBottom: '12px'
              }}>
                {score}/100
              </div>
              <div style={{
                display: 'inline-block',
                padding: '8px 24px',
                backgroundColor: segmentColor,
                color: '#ffffff',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>
                {segmentLabel}
              </div>
            </div>
          </Section>

          <Heading style={h2}>Your Top Insights</Heading>

          {insights.slice(0, 3).map((insight, index) => (
            <Section key={index} style={insightSection}>
              <Text style={insightTitle}>💡 {insight.title}</Text>
              <Text style={insightText}>{insight.description}</Text>
            </Section>
          ))}

          <Section style={ctaSection}>
            <Button
              href={resultsUrl}
              style={{
                ...button,
                backgroundColor: '#6366f1',
                color: '#ffffff',
              }}
            >
              View Full Results & Join Waitlist
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            SnapAsset AI - AI-powered home asset documentation
            <br />
            Complete your inventory in 10 minutes, not 40 hours.
          </Text>

          <Text style={{ ...footer, fontSize: '12px', marginTop: '16px' }}>
            Not interested? <Link href="#" style={link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AssessmentResultsEmail;

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
  margin: '32px 0 16px',
  padding: '0',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const scoreSection = {
  margin: '32px 0',
  padding: '32px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '2px solid #e2e8f0',
};

const insightSection = {
  margin: '16px 0',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
};

const insightTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const insightText = {
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
