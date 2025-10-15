-- Create assessment_submissions table
CREATE TABLE public.assessment_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  location text,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  segment text NOT NULL CHECK (segment IN ('critical', 'high-risk', 'moderate', 'prepared')),
  priority_level integer NOT NULL CHECK (priority_level >= 1 AND priority_level <= 4),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create waitlist table
CREATE TABLE public.waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id uuid REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  position serial,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  notified boolean DEFAULT false,
  priority_tier text NOT NULL CHECK (priority_tier IN ('critical', 'high-risk', 'moderate', 'prepared'))
);

-- Enable RLS
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_submissions (anyone can insert, no reads except admin)
CREATE POLICY "Anyone can submit assessment"
ON public.assessment_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RLS Policies for waitlist (anyone can join)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_assessment_email ON public.assessment_submissions(email);
CREATE INDEX idx_assessment_score ON public.assessment_submissions(score);
CREATE INDEX idx_assessment_segment ON public.assessment_submissions(segment);
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_priority ON public.waitlist(priority_tier);