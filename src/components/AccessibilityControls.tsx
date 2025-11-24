import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Type, Contrast, Volume2, Moon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AccessibilityControls() {
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auticare_accessibility');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        setLargeFont(prefs.largeFont || false);
        setHighContrast(prefs.highContrast || false);
        setDarkTheme(prefs.darkTheme || false);
        setTtsEnabled(prefs.ttsEnabled || false);
      } catch (e) {
        console.error('Failed to parse accessibility preferences', e);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (largeFont) {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (darkTheme) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }

    localStorage.setItem('auticare_accessibility', JSON.stringify({
      largeFont,
      highContrast,
      darkTheme,
      ttsEnabled,
    }));
  }, [largeFont, highContrast, darkTheme, ttsEnabled]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50 shadow-lg">
          <Settings className="w-5 h-5" />
          <span className="sr-only">Accessibility Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <Label htmlFor="large-font" className="cursor-pointer">
                  Large Font
                </Label>
              </div>
              <Switch
                id="large-font"
                checked={largeFont}
                onCheckedChange={setLargeFont}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                <Label htmlFor="high-contrast" className="cursor-pointer">
                  High Contrast
                </Label>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <Label htmlFor="dark-theme" className="cursor-pointer">
                  Dark Theme
                </Label>
              </div>
              <Switch
                id="dark-theme"
                checked={darkTheme}
                onCheckedChange={setDarkTheme}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <Label htmlFor="tts-enabled" className="cursor-pointer">
                  Text-to-Speech
                </Label>
              </div>
              <Switch
                id="tts-enabled"
                checked={ttsEnabled}
                onCheckedChange={setTtsEnabled}
              />
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              These settings will be saved for your next visit
            </p>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
