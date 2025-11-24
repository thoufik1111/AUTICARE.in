import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialShareProps {
  type: 'achievement' | 'progress';
  data: {
    title: string;
    content: any;
  };
}

export function SocialShare({ type, data }: SocialShareProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createShareLink = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: shareData, error } = await supabase
        .from('shared_achievements')
        .insert({
          user_id: user.id,
          title: data.title,
          content: data.content,
          is_public: isPublic,
        })
        .select()
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/shared/${shareData.share_token}`;
      setShareUrl(url);
      
      toast({
        title: "Share link created!",
        description: isPublic ? "Anyone with the link can view this." : "Only you can access this link.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating share link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your {type === 'achievement' ? 'Achievement' : 'Progress'}</DialogTitle>
          <DialogDescription>
            Create a shareable link to celebrate your milestone with your support network
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Sharing: {data.title}</h4>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="public-share" className="text-sm font-medium">
                Public Access
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic 
                  ? "Anyone with the link can view" 
                  : "Only you can access this link"}
              </p>
            </div>
            <Switch
              id="public-share"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {!shareUrl ? (
            <Button 
              onClick={createShareLink} 
              disabled={loading}
              className="w-full"
            >
              Generate Share Link
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  asChild
                >
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Share this link with family, friends, or your support team
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
