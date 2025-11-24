import { Card } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  className?: string;
}

export default function VideoPreview({ videoUrl, className = '' }: VideoPreviewProps) {
  if (!videoUrl) return null;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative aspect-video bg-muted">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs">
          <Video className="w-3 h-3" />
          <span>Uploaded Video</span>
        </div>
      </div>
    </Card>
  );
}
