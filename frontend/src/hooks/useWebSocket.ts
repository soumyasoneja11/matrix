import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { PatientEvent } from '../types/patient';

/* ──────────────────────────────────────────────
   STOMP-over-SockJS WebSocket hook
   ────────────────────────────────────────────── */

interface UseWebSocketOptions {
  /** WebSocket / SockJS endpoint, default /ws */
  url?: string;
  /** STOMP topic to subscribe to */
  topic?: string;
  /** Called when a message arrives */
  onMessage?: (event: PatientEvent) => void;
}

interface UseWebSocketReturn {
  /** Whether the STOMP client is connected */
  isConnected: boolean;
  /** The last received event */
  lastEvent: PatientEvent | null;
  /** Manually disconnect */
  disconnect: () => void;
}

export function useWebSocket(
  options: UseWebSocketOptions = {},
): UseWebSocketReturn {
  const {
    url = '/ws',
    topic = '/topic/patients',
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<PatientEvent | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(url) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        setIsConnected(true);

        client.subscribe(topic, (message: IMessage) => {
          try {
            const event: PatientEvent = JSON.parse(message.body);
            setLastEvent(event);
            onMessage?.(event);
          } catch {
            console.error('Failed to parse WebSocket message', message.body);
          }
        });
      },

      onDisconnect: () => setIsConnected(false),

      onStompError: (frame) => {
        console.error('STOMP error', frame.headers['message']);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, topic]);

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate();
  }, []);

  return { isConnected, lastEvent, disconnect };
}
