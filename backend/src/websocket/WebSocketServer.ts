import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class WebSocketServer {
    private io: Server;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*', // Allow all for now, lock down in prod
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log(`[WebSocket] Client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`[WebSocket] Client disconnected: ${socket.id}`);
            });
        });
    }

    public emit(event: string, data: any) {
        this.io.emit(event, data);
    }
}

// Singleton instance holder
let wsInstance: WebSocketServer | null = null;

export const initWebSocket = (httpServer: HttpServer) => {
    wsInstance = new WebSocketServer(httpServer);
    return wsInstance;
};

export const getWebSocket = () => {
    if (!wsInstance) {
        throw new Error('WebSocket Server not initialized');
    }
    return wsInstance;
};
