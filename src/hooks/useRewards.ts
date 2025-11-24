import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Badge {
  type: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  { type: 'first_assessment', name: 'First Steps', description: 'Complete your first assessment', icon: '🌟' },
  { type: 'five_assessments', name: 'Committed', description: 'Complete 5 assessments', icon: '🏆' },
  { type: 'calm_zone_visit', name: 'Mindful Explorer', description: 'Visit the calm zone', icon: '🧘' },
  { type: 'three_tasks', name: 'Task Master', description: 'Complete 3 tasks in calm zone', icon: '✅' },
  { type: 'game_player', name: 'Game Enthusiast', description: 'Play a mini game', icon: '🎮' },
  { type: 'progress_tracker', name: 'Progress Champion', description: 'Track progress for 7 days', icon: '📈' },
];

export function useRewards() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id);

    const earnedTypes = new Set(achievements?.map(a => a.badge_type) || []);
    
    const allBadges = BADGE_DEFINITIONS.map(def => {
      const achievement = achievements?.find(a => a.badge_type === def.type);
      return {
        ...def,
        earned: earnedTypes.has(def.type),
        earnedAt: achievement ? new Date(achievement.earned_at) : undefined,
      };
    });

    setBadges(allBadges);
    setLoading(false);
  };

  const unlockBadge = async (badgeType: string) => {
    if (!userId) return;

    const badge = badges.find(b => b.type === badgeType);
    if (!badge || badge.earned) return;

    const { error } = await supabase
      .from('achievements')
      .insert({ user_id: userId, badge_type: badgeType });

    if (!error) {
      toast({
        title: '🎉 Badge Unlocked!',
        description: `${badge.icon} ${badge.name}: ${badge.description}`,
      });
      
      // Send email notification
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        supabase.functions.invoke('send-notification', {
          body: {
            email: user.email,
            type: 'achievement',
            data: {
              title: badge.name,
              description: badge.description,
              icon: badge.icon,
            },
          },
        }).catch(err => console.error('Failed to send email:', err));
      }
      
      await fetchBadges();
    }
  };

  const checkAndUnlockBadge = async (badgeType: string) => {
    const badge = badges.find(b => b.type === badgeType);
    if (badge && !badge.earned) {
      await unlockBadge(badgeType);
    }
  };

  return {
    badges,
    loading,
    unlockBadge,
    checkAndUnlockBadge,
  };
}