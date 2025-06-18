// src/services/WebSocketService.ts
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IStompSocket, IMessage, StompSubscription } from '@stomp/stompjs';

type MessagePayload = {
    from: string;
    to?: string;
    content: string;
};

class WebSocketService {
    private client = new Client({
        reconnectDelay: 5000,
        debug: (msg) => console.log('[STOMP]', msg),
    });
    private publicSub: StompSubscription | null = null;
    private privateSub: StompSubscription | null = null;

    /**
     * @param token  JWT string
     * @param username  your current user’s email or ID to announce “joined”
     * @param onPublic   callback for messages from /topic/public
     * @param onPrivate  callback for messages from /user/queue/private
     */
    connect(
        token: string,
        username: string,
        onPublic: (msg: IMessage) => void,
        onPrivate: (msg: IMessage) => void
    ) {
        if (this.client.connected) {
            return;
        }

        // include token in the handshake URL
        this.client.webSocketFactory = (): IStompSocket =>
            new SockJS(`http://localhost:8080/ws/chat?token=${encodeURIComponent(token)}`) as unknown as IStompSocket;

        // STOMP CONNECT frame headers for any additional auth
        this.client.connectHeaders = {
            Authorization: `Bearer ${token}`,
        };

        this.client.onConnect = () => {
            // subscribe to public and private destinations
            this.publicSub = this.client.subscribe('/topic/public', onPublic);
            this.privateSub = this.client.subscribe('/user/queue/private', onPrivate);

            // announce yourself
            this.addUser(username);
        };

        this.client.activate();
    }

    sendPublic(msg: MessagePayload) {
        this.client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(msg),
        });
    }

    sendPrivate(msg: MessagePayload) {
        this.client.publish({
            destination: '/app/chat.privateMessage',
            body: JSON.stringify(msg),
        });
    }

    private addUser(username: string) {
        this.client.publish({
            destination: '/app/chat.addUser',
            body: JSON.stringify({ from: username, content: '' }),
        });
    }

    disconnect() {
        this.publicSub?.unsubscribe();
        this.privateSub?.unsubscribe();
        this.client.deactivate();
    }
}

export default new WebSocketService();
