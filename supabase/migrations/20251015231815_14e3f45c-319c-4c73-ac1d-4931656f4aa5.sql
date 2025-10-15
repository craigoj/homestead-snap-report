-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin fields to assessment_submissions
ALTER TABLE public.assessment_submissions
ADD COLUMN admin_notes TEXT,
ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
ADD COLUMN contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN contacted_by UUID REFERENCES auth.users(id);

-- Add admin fields to waitlist
ALTER TABLE public.waitlist
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'active', 'inactive')),
ADD COLUMN notes TEXT;

-- RLS policy for admins to view all assessments
CREATE POLICY "Admins can view all assessment submissions"
ON public.assessment_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to update assessments
CREATE POLICY "Admins can update assessment submissions"
ON public.assessment_submissions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to view waitlist
CREATE POLICY "Admins can view all waitlist entries"
ON public.waitlist
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to update waitlist
CREATE POLICY "Admins can update waitlist entries"
ON public.waitlist
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));