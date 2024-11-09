import { io } from 'socket.io-client';

class SocketService extends EventTarget {
    constructor() {
        super();
        if (!SocketService.instance) {
            SocketService.instance = this;
        }
        return SocketService.instance;
    }

    connect(url) {
        if (!this.socket) {
            this.socket = io(url);

            this.socket.on('connect', () => this.dispatchEvent(new Event('connect')));
            this.socket.on('disconnect', () => this.dispatchEvent(new CustomEvent('disconnect')));
            this.socket.on('Public_Message', (data) => this.dispatchEvent(new CustomEvent('Public_Message', { detail: data })));
            this.socket.on('Public_Message_Event', (data) => this.dispatchEvent(new CustomEvent('Public_Message_Event', { detail: data })));
            this.socket.on('onJoin', (user) => this.dispatchEvent(new CustomEvent('onJoin', { detail: user })));
            this.socket.on('onRejected', (msg) => this.dispatchEvent(new CustomEvent('onRejected', { detail: msg })));
            this.socket.on('onPart', (user) => this.dispatchEvent(new CustomEvent('onPart', { detail: user })))
            this.socket.on('onListUser', (users) => this.dispatchEvent(new CustomEvent('onListUser', {detail:users})));
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('sendMessage', message);
        }
    }

    joinRoom(user){
        if (this.socket && this.socket.connected) {
            this.socket.emit('onJoin', user)
        }
    }
    isConnected() {
        return this.socket ? this.socket.connected : false;
    }

    getListUser(){
        if (this.socket && this.socket.connected) {
            this.socket.emit('getListUser');
        }
    }
    updateUser(data){
        if(this.socket && this.socket.connected){
            this.socket.emit('onUpdateDataUser',data);
        }
    }
}

export const socketService = new SocketService();


