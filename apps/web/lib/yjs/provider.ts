// lib/yjs/provider.ts — Yjs document + WebSocket provider

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { setupAwareness } from './awareness';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL?.replace('ws://', 'ws://').replace('wss://', 'wss://') || 'ws://localhost:3001';

export interface YjsProviderConfig {
  roomId: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  token: string;
}

export interface YjsConnection {
  doc: Y.Doc;
  provider: WebsocketProvider;
  text: Y.Text;
  destroy: () => void;
}

export function createYjsProvider(config: YjsProviderConfig): YjsConnection {
  const doc = new Y.Doc();
  const text = doc.getText('code');

  const provider = new WebsocketProvider(
    WS_URL,
    config.roomId,
    doc,
    {
      params: {
        token: config.token,
        roomId: config.roomId,
      },
      connect: true,
      resyncInterval: 5000,
      maxBackoffTime: 10000,
    }
  );

  // Setup awareness (cursor + presence)
  setupAwareness(provider.awareness, config.user);

  // Connection status logging
  provider.on('status', (event: { status: string }) => {
    console.log(`[Yjs] Connection status: ${event.status}`);
  });

  provider.on('sync', (isSynced: boolean) => {
    console.log(`[Yjs] Sync status: ${isSynced}`);
  });

  return {
    doc,
    provider,
    text,
    destroy: () => {
      provider.disconnect();
      provider.destroy();
      doc.destroy();
    },
  };
}
