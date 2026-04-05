'use client';

import { useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Settings,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RemoteStream {
  peerId: string;
  stream: MediaStream;
}

interface VideoPanelProps {
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onStartScreenShare: () => void;
  onStopScreenShare: () => void;
}

function VideoTile({
  stream,
  muted = false,
  label,
  isLocal = false,
  videoEnabled = true,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
  isLocal?: boolean;
  videoEnabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-editor-bg border border-editor-border aspect-video">
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={cn(
            "w-full h-full object-cover",
            isLocal && "transform -scale-x-100"
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-editor-surface to-editor-bg">
          <div className="w-12 h-12 rounded-full bg-editor-border flex items-center justify-center">
            <User className="w-6 h-6 text-editor-comment" />
          </div>
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
        {label}
        {isLocal && ' (You)'}
      </div>
    </div>
  );
}

export function VideoPanel({
  localStream,
  remoteStreams,
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onStartScreenShare,
  onStopScreenShare,
}: VideoPanelProps) {
  return (
    <div className="flex flex-col h-full bg-editor-surface border-l border-editor-border">
      {/* Video Grid */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {/* Local video */}
        <VideoTile
          stream={localStream}
          muted
          label="You"
          isLocal
          videoEnabled={videoEnabled}
        />

        {/* Remote videos */}
        {remoteStreams.map(({ peerId, stream }) => (
          <VideoTile
            key={peerId}
            stream={stream}
            label={`Participant`}
            videoEnabled
          />
        ))}

        {/* Empty state */}
        {remoteStreams.length === 0 && (
          <div className="flex items-center justify-center p-4 rounded-lg border border-dashed border-editor-border text-editor-comment text-xs text-center">
            Waiting for others to join...
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-2 p-3 border-t border-editor-border bg-editor-bg">
        <button
          onClick={onToggleAudio}
          className={cn(
            "p-2.5 rounded-full transition-all",
            audioEnabled
              ? "bg-editor-surface text-editor-text hover:bg-editor-border"
              : "bg-brand-danger text-white hover:bg-red-600"
          )}
          title={audioEnabled ? 'Mute' : 'Unmute'}
        >
          {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <button
          onClick={onToggleVideo}
          className={cn(
            "p-2.5 rounded-full transition-all",
            videoEnabled
              ? "bg-editor-surface text-editor-text hover:bg-editor-border"
              : "bg-brand-danger text-white hover:bg-red-600"
          )}
          title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoEnabled ? (
            <Camera className="w-4 h-4" />
          ) : (
            <CameraOff className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={isScreenSharing ? onStopScreenShare : onStartScreenShare}
          className={cn(
            "p-2.5 rounded-full transition-all",
            isScreenSharing
              ? "bg-brand-primary text-white hover:bg-brand-primary-dark"
              : "bg-editor-surface text-editor-text hover:bg-editor-border"
          )}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? (
            <MonitorOff className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
