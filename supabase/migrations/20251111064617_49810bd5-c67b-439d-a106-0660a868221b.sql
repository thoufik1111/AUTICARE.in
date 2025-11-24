-- Create table for shared achievements and progress
CREATE TABLE public.shared_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own shared achievements
CREATE POLICY "Users can view their own shared achievements"
ON public.shared_achievements
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own shared achievements
CREATE POLICY "Users can insert their own shared achievements"
ON public.shared_achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own shared achievements
CREATE POLICY "Users can update their own shared achievements"
ON public.shared_achievements
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own shared achievements
CREATE POLICY "Users can delete their own shared achievements"
ON public.shared_achievements
FOR DELETE
USING (auth.uid() = user_id);

-- Public shared achievements can be viewed by anyone (using token)
CREATE POLICY "Public shared achievements can be viewed with token"
ON public.shared_achievements
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Create index on share_token for faster lookups
CREATE INDEX idx_shared_achievements_token ON public.shared_achievements(share_token);
CREATE INDEX idx_shared_achievements_user ON public.shared_achievements(user_id);