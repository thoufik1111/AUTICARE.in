import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CalmZoneProps {
  onBack: () => void;
}

export default function CalmZone({ onBack }: CalmZoneProps) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentYogaPose, setCurrentYogaPose] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const yogaPoses = [
    {
      name: 'Mountain Pose',
      emoji: '🧘',
      steps: [
        'Stand with feet together',
        'Arms relaxed at your sides',
        'Take deep breaths',
        'Feel grounded and stable',
      ],
    },
    {
      name: 'Tree Pose',
      emoji: '🌳',
      steps: [
        'Stand on one leg',
        'Place other foot on inner thigh',
        'Hands together at chest',
        'Balance and breathe',
      ],
    },
    {
      name: 'Child\'s Pose',
      emoji: '🙏',
      steps: [
        'Kneel on the floor',
        'Sit back on your heels',
        'Stretch arms forward',
        'Rest forehead on ground',
      ],
    },
    {
      name: 'Cat-Cow Stretch',
      emoji: '🐱',
      steps: [
        'Start on hands and knees',
        'Arch back up (Cat)',
        'Curve spine down (Cow)',
        'Repeat slowly with breath',
      ],
    },
  ];

  const sounds = [
    { id: 'nature', name: 'Nature Sounds', emoji: '🌲', description: 'Forest and birds' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', description: 'Calming waves' },
    { id: 'rain', name: 'Gentle Rain', emoji: '🌧️', description: 'Soft rainfall' },
    { id: 'asmr', name: 'ASMR Whispers', emoji: '🎧', description: 'Soothing whispers' },
  ];

  const handleSoundToggle = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
      toast.info('Sound stopped');
    } else {
      setActiveSound(soundId);
      toast.success(`Playing ${sounds.find(s => s.id === soundId)?.name}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint/20 via-background to-lavender/20">
      <div className="max-w-4xl w-full space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-2 border-mint">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl mb-2">Calm Zone</CardTitle>
            <CardDescription className="text-lg">
              Take a moment to breathe and relax
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="breathing" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breathing">Breathing</TabsTrigger>
                <TabsTrigger value="yoga">Yoga</TabsTrigger>
                <TabsTrigger value="sounds">Sounds</TabsTrigger>
                <TabsTrigger value="affirmations">Quotes</TabsTrigger>
              </TabsList>

              {/* Breathing Tab */}
              <TabsContent value="breathing" className="space-y-8">
                <div className="flex flex-col items-center py-12">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint to-bright-blue opacity-30 animate-breathe" />
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-lavender to-mint opacity-40 animate-breathe" 
                         style={{ animationDelay: '0.5s' }} />
                    <div className="absolute inset-16 rounded-full bg-gradient-to-br from-bright-blue to-lavender opacity-50 animate-breathe" 
                         style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-semibold">Breathe</p>
                        <p className="text-sm text-muted-foreground">Follow the circle</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-accent/30">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-mint mx-auto mb-2 flex items-center justify-center text-xl font-bold">
                          4
                        </div>
                        <p className="text-sm font-medium">Breathe In</p>
                      </div>
                      <div>
                        <div className="w-12 h-12 rounded-full bg-bright-blue mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white">
                          4
                        </div>
                        <p className="text-sm font-medium">Hold</p>
                      </div>
                      <div>
                        <div className="w-12 h-12 rounded-full bg-lavender mx-auto mb-2 flex items-center justify-center text-xl font-bold">
                          4
                        </div>
                        <p className="text-sm font-medium">Breathe Out</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Yoga Tab */}
              <TabsContent value="yoga" className="space-y-6">
                <Card className="bg-gradient-to-br from-mint/20 to-lavender/20">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{yogaPoses[currentYogaPose].emoji}</div>
                    <CardTitle className="text-2xl">{yogaPoses[currentYogaPose].name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {yogaPoses[currentYogaPose].steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-bright-blue text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <p className="text-base">{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-center pt-4">
                      {yogaPoses.map((_, index) => (
                        <Button
                          key={index}
                          variant={currentYogaPose === index ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentYogaPose(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sounds Tab */}
              <TabsContent value="sounds" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sounds.map((sound) => (
                    <Card
                      key={sound.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        activeSound === sound.id ? 'ring-2 ring-bright-blue' : ''
                      }`}
                      onClick={() => handleSoundToggle(sound.id)}
                    >
                      <CardContent className="pt-6 text-center space-y-3">
                        <div className="text-5xl">{sound.emoji}</div>
                        <h3 className="text-xl font-semibold">{sound.name}</h3>
                        <p className="text-sm text-muted-foreground">{sound.description}</p>
                        <div className="pt-2">
                          {activeSound === sound.id ? (
                            <div className="flex items-center justify-center gap-2 text-bright-blue">
                              <Volume2 className="w-5 h-5" />
                              <span className="font-medium">Playing</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                              <VolumeX className="w-5 h-5" />
                              <span>Tap to play</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Affirmations Tab */}
              <TabsContent value="affirmations" className="space-y-4">
                {[
                  "You are doing great. Take your time. You've got this.",
                  "Every small step forward is progress worth celebrating.",
                  "Your feelings are valid. It's okay to take breaks.",
                  "You are stronger than you know. Keep going.",
                  "Progress, not perfection. You're doing wonderfully.",
                ].map((quote, index) => (
                  <Card key={index} className="bg-gradient-to-r from-mint/20 to-lavender/20">
                    <CardContent className="pt-6 text-center">
                      <p className="text-lg font-medium italic">"{quote}"</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
