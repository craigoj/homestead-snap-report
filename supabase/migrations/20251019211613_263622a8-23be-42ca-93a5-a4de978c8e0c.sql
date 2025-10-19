-- Create jumpstart_sessions table to track user onboarding progress
CREATE TABLE public.jumpstart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mode VARCHAR(50) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  items_target INTEGER NOT NULL,
  items_completed INTEGER DEFAULT 0,
  total_value NUMERIC(10,2) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jumpstart_prompts table to track individual prompt completion
CREATE TABLE public.jumpstart_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.jumpstart_sessions(id) ON DELETE CASCADE NOT NULL,
  prompt_index INTEGER NOT NULL,
  prompt_id VARCHAR(100) NOT NULL,
  item_category VARCHAR(100),
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jumpstart_feedback table for prompt optimization
CREATE TABLE public.jumpstart_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id VARCHAR(100) NOT NULL,
  helpful BOOLEAN,
  skipped BOOLEAN,
  completion_time_seconds INTEGER,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.jumpstart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jumpstart_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jumpstart_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jumpstart_sessions
CREATE POLICY "Users can view their own jumpstart sessions"
  ON public.jumpstart_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jumpstart sessions"
  ON public.jumpstart_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jumpstart sessions"
  ON public.jumpstart_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jumpstart sessions"
  ON public.jumpstart_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for jumpstart_prompts
CREATE POLICY "Users can view prompts for their sessions"
  ON public.jumpstart_prompts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jumpstart_sessions
      WHERE id = jumpstart_prompts.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert prompts for their sessions"
  ON public.jumpstart_prompts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jumpstart_sessions
      WHERE id = jumpstart_prompts.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update prompts for their sessions"
  ON public.jumpstart_prompts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jumpstart_sessions
      WHERE id = jumpstart_prompts.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete prompts for their sessions"
  ON public.jumpstart_prompts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.jumpstart_sessions
      WHERE id = jumpstart_prompts.session_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for jumpstart_feedback
CREATE POLICY "Users can view their own feedback"
  ON public.jumpstart_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON public.jumpstart_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON public.jumpstart_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON public.jumpstart_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_jumpstart_sessions_user_id ON public.jumpstart_sessions(user_id);
CREATE INDEX idx_jumpstart_sessions_completed ON public.jumpstart_sessions(completed);
CREATE INDEX idx_jumpstart_prompts_session_id ON public.jumpstart_prompts(session_id);
CREATE INDEX idx_jumpstart_feedback_user_id ON public.jumpstart_feedback(user_id);
CREATE INDEX idx_jumpstart_feedback_prompt_id ON public.jumpstart_feedback(prompt_id);