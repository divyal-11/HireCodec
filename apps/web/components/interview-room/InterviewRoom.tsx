'use client';

import { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodePanel } from './CodePanel';
import { VideoPanel } from './VideoPanel';
import { QuestionPanel } from './QuestionPanel';
import { TestResults } from './TestResults';
import { ChatDrawer } from './ChatDrawer';
import { RoomToolbar } from './RoomToolbar';
import { ReconnectBanner } from './ReconnectBanner';
import { useRoom } from '@/hooks/useRoom';
import { useEditor } from '@/hooks/useEditor';
import { useVideo } from '@/hooks/useVideo';
import { useExecution } from '@/hooks/useExecution';
import { useTimer } from '@/hooks/useTimer';

interface InterviewRoomProps {
  roomId: string;
  token: string;
  userName: string;
  role: string;
}

export function InterviewRoom({ roomId, token, userName, role }: InterviewRoomProps) {
  const room = useRoom({ roomId, token, userName });
  const editor = useEditor({ roomId, role });
  const video = useVideo(roomId);
  const execution = useExecution(roomId);
  const timer = useTimer(roomId);

  useEffect(() => {
    room.joinRoom();
    video.initVideo();
  }, []);

  return (
    <div className="interview-room h-screen flex flex-col overflow-hidden">
      {/* Connection status */}
      {!room.connected && <ReconnectBanner />}

      {/* Top toolbar */}
      <RoomToolbar
        roomId={roomId}
        role={role}
        timer={timer}
        language={editor.language}
        onLanguageChange={editor.setLanguage}
        onEndInterview={room.endInterview}
      />

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left: Question Panel */}
          <Panel defaultSize={25} minSize={15} maxSize={40}>
            <QuestionPanel
              question={room.roomState?.currentQuestion || null}
              role={role}
            />
          </Panel>

          <PanelResizeHandle />

          {/* Center: Code Editor + Output */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={65} minSize={30}>
                <CodePanel
                  roomId={roomId}
                  token={token}
                  user={{ id: 'user', name: userName, role }}
                  language={editor.language}
                  theme={editor.theme}
                  fontSize={editor.fontSize}
                  isReadOnly={editor.isReadOnly}
                  onRun={(code) => execution.runCode(code, editor.language)}
                  onSubmit={(code) =>
                    execution.submitCode(
                      code,
                      editor.language,
                      room.roomState?.currentQuestion?.id || ''
                    )
                  }
                  executing={execution.executing}
                />
              </Panel>

              <PanelResizeHandle />

              {/* Output / Test Results */}
              <Panel defaultSize={35} minSize={15}>
                <TestResults
                  result={execution.result}
                  error={execution.error}
                  executing={execution.executing}
                />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle />

          {/* Right: Video + Chat */}
          <Panel defaultSize={25} minSize={15} maxSize={35}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <VideoPanel
                  localStream={video.localStream}
                  remoteStreams={video.remoteStreams}
                  audioEnabled={video.audioEnabled}
                  videoEnabled={video.videoEnabled}
                  isScreenSharing={video.isScreenSharing}
                  onToggleAudio={video.toggleAudio}
                  onToggleVideo={video.toggleVideo}
                  onStartScreenShare={video.startScreenShare}
                  onStopScreenShare={video.stopScreenShare}
                />
              </Panel>

              <PanelResizeHandle />

              <Panel defaultSize={50} minSize={20}>
                <ChatDrawer
                  roomId={roomId}
                  onSendMessage={room.sendChat}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
