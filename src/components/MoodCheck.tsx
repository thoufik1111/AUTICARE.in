import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { ScoringResult } from '@/utils/scoring';

interface MoodCheckProps {
  result: ScoringResult;
}

type Mood = 'good' | 'okay' | 'tough' | null;

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything! 😄",
  "What do you call a bear with no teeth? A gummy bear! 🐻",
  "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
  "What do you call a fake noodle? An impasta! 🍝",
  "Why did the bicycle fall over? It was two-tired! 🚴",
];

const positiveQuotes = [
  "You are doing amazing! Keep up the great work! 🌟",
  "Every small step forward is progress. Be proud! 💪",
  "Your effort and courage are inspiring! ✨",
  "You're stronger than you know! 🦋",
  "Celebrate this moment - you've earned it! 🎉",
];

export default function MoodCheck({ result }: MoodCheckProps) {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [response, setResponse] = useState('');

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    setReason('');
    setResponse('');
    
    if (mood === 'good') {
      const randomQuote = positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)];
      setResponse(randomQuote);
      setShowDialog(true);
    } else if (mood === 'okay') {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      const motivation = getMotivationalMessage(result);
      setResponse(`${randomJoke}\n\n${motivation}`);
      setShowDialog(true);
    } else if (mood === 'tough') {
      setShowDialog(true);
    }
  };

  const handleReasonSubmit = () => {
    if (selectedMood === 'tough' && reason.trim()) {
      const tips = getTipsForChallenge(reason, result);
      setResponse(tips);
    }
  };

  const getMotivationalMessage = (result: ScoringResult): string => {
    const messages: Record<ScoringResult['severity'], string> = {
      low: "You're building great habits! Keep this momentum going. Remember, consistency is key. 💫",
      mild: "You're making progress every day! Small steps lead to big changes. Keep pushing forward! 🌱",
      moderate: "You're doing really well managing challenges! Remember to be patient with yourself. You've got this! 🌈",
      high: "You're incredibly brave for taking these steps! Remember, asking for help is a sign of strength. You're not alone. 💙",
    };
    return messages[result.severity];
  };

  const getTipsForChallenge = (reason: string, result: ScoringResult): string => {
    const reasonLower = reason.toLowerCase();
    let tips = "I hear you, and it's okay to feel this way. Here are some things that might help:\n\n";

    if (reasonLower.includes('overwhelm') || reasonLower.includes('stress') || reasonLower.includes('anxiety')) {
      tips += "🌊 Try the 5-4-3-2-1 grounding technique:\n";
      tips += "• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\n";
      tips += "💙 Visit the Calm Zone for breathing exercises.\n";
    } else if (reasonLower.includes('tired') || reasonLower.includes('exhaust') || reasonLower.includes('energy')) {
      tips += "😴 Rest is productive too!\n";
      tips += "• Take a short 10-minute break\n• Get some fresh air\n• Try gentle stretching\n• Have a healthy snack\n\n";
    } else if (reasonLower.includes('social') || reasonLower.includes('people') || reasonLower.includes('interact')) {
      tips += "🤝 Social challenges are real:\n";
      tips += "• It's okay to take social breaks\n• Start with short, one-on-one interactions\n• Practice self-compassion\n• Remember: quality over quantity in friendships\n\n";
    } else if (reasonLower.includes('sensory') || reasonLower.includes('noise') || reasonLower.includes('loud')) {
      tips += "🎧 Managing sensory input:\n";
      tips += "• Use noise-canceling headphones\n• Find a quiet space\n• Adjust lighting if too bright\n• Take sensory breaks regularly\n\n";
    } else {
      tips += "💚 General support strategies:\n";
      tips += "• Practice self-compassion\n• Break tasks into smaller steps\n• Ask for help when needed\n• Take breaks without guilt\n";
      tips += "• Remember: One step at a time is okay\n\n";
    }

    if (result.severity === 'high' || result.severity === 'moderate') {
      tips += "\n🤝 Consider reaching out to a clinician or trusted support person. You don't have to face this alone.";
    }

    return tips;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Quick Mood Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <button 
              onClick={() => handleMoodClick('good')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-all hover:scale-110"
              aria-label="Feeling good"
            >
              <Smile className="w-8 h-8 text-mint" />
              <span className="text-xs font-medium">Good</span>
            </button>
            <button 
              onClick={() => handleMoodClick('okay')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-all hover:scale-110"
              aria-label="Feeling okay"
            >
              <Meh className="w-8 h-8 text-bright-blue" />
              <span className="text-xs font-medium">Okay</span>
            </button>
            <button 
              onClick={() => handleMoodClick('tough')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-all hover:scale-110"
              aria-label="Having a tough time"
            >
              <Frown className="w-8 h-8 text-coral" />
              <span className="text-xs font-medium">Tough</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMood === 'good' && <><Sparkles className="w-5 h-5 text-mint" /> Wonderful! </>}
              {selectedMood === 'okay' && <><Smile className="w-5 h-5 text-bright-blue" /> Let's brighten your day! </>}
              {selectedMood === 'tough' && <><Heart className="w-5 h-5 text-coral" /> We're here for you </>}
            </DialogTitle>
            <DialogDescription>
              {selectedMood === 'tough' && !response && "Would you like to share what's making things tough? This helps us provide better support."}
              {selectedMood === 'good' && "Keep that positive energy going!"}
              {selectedMood === 'okay' && "A little boost for you!"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedMood === 'tough' && !response && (
              <>
                <Textarea
                  placeholder="What's making things difficult right now? (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleReasonSubmit}
                  disabled={!reason.trim()}
                  className="w-full"
                >
                  Get Support Tips
                </Button>
              </>
            )}

            {response && (
              <div className="bg-accent/50 p-4 rounded-lg whitespace-pre-line">
                {response}
              </div>
            )}

            {selectedMood === 'tough' && !response && reason.trim() === '' && (
              <Button 
                variant="outline"
                onClick={() => {
                  const tips = getTipsForChallenge('general', result);
                  setResponse(tips);
                }}
                className="w-full"
              >
                Show General Support Tips
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
