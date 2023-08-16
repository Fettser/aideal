import {io} from "socket.io-client";

export const socket = io('https://aa1d-185-16-137-141.ngrok-free.app', {
    autoConnect: false
})