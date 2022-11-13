import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';
import { IServerToClientEvent } from './interfaces';
import { DrawPoint } from './models/draw-point.model';

export class SocketServer {
    public static instance: SocketServer;
    public io: Server;

    /* Master list of all connected borad */
    public boards: { [uid: string]: string };

    /* List of all sketch */
    public allSketch: DrawPoint[];

    constructor(server: HTTPServer) {
        SocketServer.instance = this;

        this.boards = {};
        this.allSketch = [];

        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.startListeners);

        logger.info('Started socket connection');
    }

    startListeners = (socket: Socket) => {
        logger.info(`Message received from ${socket.id}`);

        socket.on('handshake', (callback: (uid: string, boards: string[]) => void) => {
            logger.info(`handshake received from ${socket.id}`);

            /* Check if this user is reconnecting */
            const reconnected = Object.values(this.boards).includes(socket.id);

            if (reconnected) {
                logger.info(`This board has reconnected`);

                const uid = this.getUidFromSocket(socket.id);
                const boards = Object.values(this.boards);

                if (uid) {
                    logger.info('Send callback for reconnection ...');
                    callback(uid, boards);
                    return ;
                }
            }

            /* Generate a new board */
            const uid = v4();
            this.boards[uid] = socket.id;
            const boards = Object.values(this.boards);

            logger.info('Sending callback for handshake ...');
            callback(uid, boards);

            /* Send this new board to all connected board */
            this.sendMessage(
                'board_connected',
                boards.filter((id) => id !== socket.id),
                boards
            );
        });

        socket.emit('ping', 'pong');

        socket.on('disconnect', () => {
            logger.info(` Disconnection has been received from ${socket.id}`);
            
            // get board id
            const uid = this.getUidFromSocket(socket.id);

            if (uid) {
                delete this.boards[uid];
                const boards = Object.values(this.boards);
                this.sendMessage(
                    'board_disconnected',
                    boards,
                    uid,
                );
            }
        });

        socket.on('draw', (point: DrawPoint, callback: (uid: string, boards: string[], point: DrawPoint, allSketch: DrawPoint[]) => void) => {
            // get board id
            const uid = this.getUidFromSocket(socket.id);

            if (uid) {
                // add skecth to allSketch array
                this.allSketch.push(point);
                const boards = Object.values(this.boards);
                logger.info('Sending callback for darwing ...');
                callback(uid, boards, point, this.allSketch);

                // emmit drawing sketch
                this.sendMessage('draw', boards, point);

                // emit sectches
                this.sendMessage('get_sketch', boards, this.allSketch);
            }
        });
    }

    sendMessage = (name: string, borads: string[], payload?: Object) => {
        logger.info(`Emmiting event ${name} to ${borads}`);
        borads.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    }

    private getUidFromSocket = (id: string) => Object.keys(this.boards).find((uid) => this.boards[uid] === id);
}
