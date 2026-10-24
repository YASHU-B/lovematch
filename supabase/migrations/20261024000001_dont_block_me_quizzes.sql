-- Don't Block Me / LoveMatch Viral Quizzes Migration
-- Complete PostgreSQL schema for Supabase

-- 1. Viral Quizzes table
CREATE TABLE IF NOT EXISTS public.viral_quizzes (
  id VARCHAR(10) PRIMARY KEY,
  creator_name VARCHAR(50) NOT NULL,
  secret_token VARCHAR(64) NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '30 days')
);

-- 2. Viral Quiz Attempts / Friend Scores table
CREATE TABLE IF NOT EXISTS public.viral_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id VARCHAR(10) NOT NULL REFERENCES public.viral_quizzes(id) ON DELETE CASCADE,
  friend_name VARCHAR(50) NOT NULL,
  answers JSONB NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 10,
  percentage INT NOT NULL DEFAULT 0,
  verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('safe', 'warning', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for high-performance ranking & lookups
CREATE INDEX IF NOT EXISTS idx_viral_quizzes_id ON public.viral_quizzes(id);
CREATE INDEX IF NOT EXISTS idx_viral_quiz_attempts_quiz_id ON public.viral_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_viral_quiz_attempts_ranking ON public.viral_quiz_attempts(quiz_id, score DESC, created_at ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.viral_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viral_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Viral Quizzes
DROP POLICY IF EXISTS "Allow public insert viral_quizzes" ON public.viral_quizzes;
CREATE POLICY "Allow public insert viral_quizzes" 
  ON public.viral_quizzes FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select viral_quizzes" ON public.viral_quizzes;
CREATE POLICY "Allow public select viral_quizzes" 
  ON public.viral_quizzes FOR SELECT 
  USING (true);

-- 6. RLS Policies for Viral Quiz Attempts
DROP POLICY IF EXISTS "Allow public insert viral_quiz_attempts" ON public.viral_quiz_attempts;
CREATE POLICY "Allow public insert viral_quiz_attempts" 
  ON public.viral_quiz_attempts FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select viral_quiz_attempts" ON public.viral_quiz_attempts;
CREATE POLICY "Allow public select viral_quiz_attempts" 
  ON public.viral_quiz_attempts FOR SELECT 
  USING (true);

-- 7. Add to Realtime publication for instant scoreboard updates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.viral_quiz_attempts;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
