import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Circle, Square, Triangle } from 'lucide-react';
import { toast } from 'sonner';

interface MiniGamesProps {
  onBack: () => void;
}

export default function MiniGames({ onBack }: MiniGamesProps) {
  const [currentGame, setCurrentGame] = useState<'menu' | 'memory' | 'shapes' | 'colors'>('menu');
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; value: string; flipped: boolean; matched: boolean }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // Memory Game
  const initMemoryGame = () => {
    const symbols = ['🌟', '🌈', '🌸', '🦋', '🌺', '🌻'];
    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }));
    setMemoryCards(cards);
    setSelectedCards([]);
    setScore(0);
    setCurrentGame('memory');
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2) return;
    if (memoryCards[id].matched || memoryCards[id].flipped) return;

    const newCards = [...memoryCards];
    newCards[id].flipped = true;
    setMemoryCards(newCards);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (memoryCards[first].value === memoryCards[second].value) {
        setTimeout(() => {
          const matched = [...memoryCards];
          matched[first].matched = true;
          matched[second].matched = true;
          setMemoryCards(matched);
          setSelectedCards([]);
          setScore(score + 10);
          toast.success('Great match! 🎉');
        }, 500);
      } else {
        setTimeout(() => {
          const unflipped = [...memoryCards];
          unflipped[first].flipped = false;
          unflipped[second].flipped = false;
          setMemoryCards(unflipped);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Shape Matching Game
  const [shapeTarget, setShapeTarget] = useState<string>('');
  const [shapeScore, setShapeScore] = useState(0);
  const shapes = [
    { name: 'circle', icon: Circle, color: 'text-mint' },
    { name: 'square', icon: Square, color: 'text-bright-blue' },
    { name: 'triangle', icon: Triangle, color: 'text-lavender' },
  ];

  const initShapeGame = () => {
    setShapeTarget(shapes[Math.floor(Math.random() * shapes.length)].name);
    setShapeScore(0);
    setCurrentGame('shapes');
  };

  const handleShapeClick = (shapeName: string) => {
    if (shapeName === shapeTarget) {
      setShapeScore(shapeScore + 5);
      toast.success('Perfect! 🎯');
      setShapeTarget(shapes[Math.floor(Math.random() * shapes.length)].name);
    } else {
      toast.error('Try again! 💪');
    }
  };

  // Color Matching Game
  const [colorTarget, setColorTarget] = useState('');
  const [colorScore, setColorScore] = useState(0);
  const colors = [
    { name: 'Mint', class: 'bg-mint', hex: '#7CE3C7' },
    { name: 'Blue', class: 'bg-bright-blue', hex: '#2F9BFF' },
    { name: 'Lavender', class: 'bg-lavender', hex: '#CFC8FF' },
    { name: 'Coral', class: 'bg-coral', hex: '#FF6B6B' },
  ];

  const initColorGame = () => {
    setColorTarget(colors[Math.floor(Math.random() * colors.length)].name);
    setColorScore(0);
    setCurrentGame('colors');
  };

  const handleColorClick = (colorName: string) => {
    if (colorName === colorTarget) {
      setColorScore(colorScore + 5);
      toast.success('Excellent! 🌈');
      setColorTarget(colors[Math.floor(Math.random() * colors.length)].name);
    } else {
      toast.error('Not quite! Keep trying! 🎨');
    }
  };

  if (currentGame === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint/20 via-background to-lavender/20">
        <div className="max-w-4xl w-full space-y-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-2 border-bright-blue">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl mb-2">Mini Games 🎮</CardTitle>
              <CardDescription className="text-lg">
                Choose a game to play and have fun!
              </CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={initMemoryGame}>
                <CardHeader>
                  <CardTitle className="text-2xl">Memory Match</CardTitle>
                  <CardDescription>Find matching pairs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center">🧠</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={initShapeGame}>
                <CardHeader>
                  <CardTitle className="text-2xl">Shape Finder</CardTitle>
                  <CardDescription>Click the right shape</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center">🔷</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={initColorGame}>
                <CardHeader>
                  <CardTitle className="text-2xl">Color Match</CardTitle>
                  <CardDescription>Find the matching color</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-center">🌈</div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentGame === 'memory') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint/20 via-background to-lavender/20">
        <div className="max-w-4xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <div className="flex gap-4">
              <div className="text-lg font-semibold">Score: {score}</div>
              <Button variant="outline" size="sm" onClick={initMemoryGame}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>

          <Card className="border-2 border-mint">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Memory Match 🧠</CardTitle>
              <CardDescription>Find all the matching pairs!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                {memoryCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all ${
                      card.flipped || card.matched
                        ? 'bg-gradient-to-br from-mint to-bright-blue'
                        : 'bg-gradient-to-br from-gray-300 to-gray-400'
                    } ${card.matched ? 'opacity-50' : 'hover:scale-105'}`}
                  >
                    {(card.flipped || card.matched) && card.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentGame === 'shapes') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint/20 via-background to-lavender/20">
        <div className="max-w-4xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <div className="text-lg font-semibold">Score: {shapeScore}</div>
          </div>

          <Card className="border-2 border-bright-blue">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Shape Finder 🔷</CardTitle>
              <CardDescription className="text-xl mt-4">
                Click the: <span className="font-bold text-primary capitalize">{shapeTarget}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-8">
                {shapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <div
                      key={shape.name}
                      onClick={() => handleShapeClick(shape.name)}
                      className="aspect-square rounded-xl bg-accent/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Icon className={`w-24 h-24 ${shape.color}`} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentGame === 'colors') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint/20 via-background to-lavender/20">
        <div className="max-w-4xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <div className="text-lg font-semibold">Score: {colorScore}</div>
          </div>

          <Card className="border-2 border-lavender">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Color Match 🌈</CardTitle>
              <CardDescription className="text-xl mt-4">
                Click the color: <span className="font-bold text-primary">{colorTarget}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mt-8">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    onClick={() => handleColorClick(color.name)}
                    className={`aspect-square rounded-xl ${color.class} cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                  >
                    {color.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
