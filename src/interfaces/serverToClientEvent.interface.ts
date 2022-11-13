export default interface IServerToClientEvent {
    ping: () => any;
    handshake: (callback: () => {}) => void;
    sendSkectch: (points: {}, ) => void;
    getAllSkectch: (callback: () => void) => any;
}
