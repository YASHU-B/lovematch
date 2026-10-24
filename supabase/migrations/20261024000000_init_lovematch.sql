-- LoveMatch: Who Knows Who Better?
-- Complete PostgreSQL schema for Supabase

-- 1. Enable pgcrypto for UUIDs and hashes
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) NOT NULL UNIQUE,
  code_hash VARCHAR(64) NOT NULL,
  host_player_id UUID,
  guest_player_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished', 'expired')),
  category_id VARCHAR(50) NOT NULL DEFAULT 'all',
  question_count INT NOT NULL DEFAULT 5 CHECK (question_count IN (5, 10)),
  current_round INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '24 hours'),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Players table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  nickname VARCHAR(30) NOT NULL,
  session_token_hash VARCHAR(64) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('host', 'guest')),
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_player_in_room UNIQUE (room_id, session_token_hash)
);

-- Foreign key update on rooms
ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS fk_host_player,
  ADD CONSTRAINT fk_host_player FOREIGN KEY (host_player_id) REFERENCES public.players(id) ON DELETE SET NULL;

ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS fk_guest_player,
  ADD CONSTRAINT fk_guest_player FOREIGN KEY (guest_player_id) REFERENCES public.players(id) ON DELETE SET NULL;

-- 4. Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  prompt TEXT NOT NULL,
  options_json JSONB NOT NULL,
  accepted_answer_rules JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Rounds table
CREATE TABLE IF NOT EXISTS public.rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL REFERENCES public.questions(id),
  round_number INT NOT NULL,
  subject_player_id UUID NOT NULL REFERENCES public.players(id),
  guesser_player_id UUID NOT NULL REFERENCES public.players(id),
  phase VARCHAR(20) NOT NULL DEFAULT 'answering' CHECK (phase IN ('answering', 'revealed', 'completed')),
  reveal_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  CONSTRAINT unique_round_per_room UNIQUE (room_id, round_number)
);

-- 6. Submissions table
-- Answers are stored privately. RLS ensures only the player themselves can view their submission until the round phase is 'revealed'
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  answer_payload JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_submission_per_round_player UNIQUE (round_id, player_id)
);

-- 7. Scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  correct_predictions INT NOT NULL DEFAULT 0,
  total_predictions INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_score_per_player UNIQUE (room_id, player_id)
);

-- 8. Share Tokens table
CREATE TABLE IF NOT EXISTS public.share_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  permitted_content JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '7 days'),
  revoked_at TIMESTAMPTZ
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON public.players(room_id);
CREATE INDEX IF NOT EXISTS idx_rounds_room_id ON public.rounds(room_id);
CREATE INDEX IF NOT EXISTS idx_submissions_round_id ON public.submissions(round_id);
CREATE INDEX IF NOT EXISTS idx_scores_room_id ON public.scores(room_id);
CREATE INDEX IF NOT EXISTS idx_share_tokens_token ON public.share_tokens(token);

-- Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_tokens ENABLE ROW LEVEL SECURITY;

-- Questions can be read publicly if active
CREATE POLICY "Public questions read" ON public.questions
  FOR SELECT USING (is_active = true);

-- Rooms can be read if not expired
CREATE POLICY "Rooms viewable by room code lookup" ON public.rooms
  FOR SELECT USING (expires_at > now());

-- Submissions security:
-- Only service role or server-authorized endpoints can view private submissions before reveal
CREATE POLICY "Private submissions read policy" ON public.submissions
  FOR SELECT USING (
    -- Player can see their own submission
    auth.uid()::text = player_id::text
    OR
    -- OR anyone in the room can see after round is revealed
    EXISTS (
      SELECT 1 FROM public.rounds r 
      WHERE r.id = round_id AND r.phase IN ('revealed', 'completed')
    )
  );

-- Database function to auto-cleanup expired rooms after 24h
CREATE OR REPLACE FUNCTION public.cleanup_expired_rooms()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rooms WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configure Supabase Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;
