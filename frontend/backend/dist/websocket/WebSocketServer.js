"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocket = exports.initWebSocket = exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
class WebSocketServer {
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*', // Allow all for now, lock down in prod
                methods: ['GET', 'POST']
            }
        });
        this.io.on('connection', (socket) => {
            console.log(`[WebSocket] Client connected: ${socket.id}`);
            socket.on('disconnect', () => {
                console.log(`[WebSocket] Client disconnected: ${socket.id}`);
            });
        });
    }
    emit(event, data) {
        this.io.emit(event, data);
    }
}
exports.WebSocketServer = WebSocketServer;
// Singleton instance holder
let wsInstance = null;
const initWebSocket = (httpServer) => {
    wsInstance = new WebSocketServer(httpServer);
    return wsInstance;
};
exports.initWebSocket = initWebSocket;
const getWebSocket = () => {
    if (!wsInstance) {
        throw new Error('WebSocket Server not initialized');
    }
    return wsInstance;
};
exports.getWebSocket = getWebSocket;
