import React, {useEffect, useRef} from 'react';
import ChatList from "../components/Chat/ChatList";
import Chat from "../components/Chat/Chat";
import {Socket} from "socket.io-client";
import {socket} from "../socket/socket";

const Messenger = () => {
    const socketRef = useRef<Socket>(socket.connect())

    useEffect(() => {
        return () => {
            socketRef.current?.disconnect()
        }
    }, [])

    return (
        <>
            <ChatList socket={socketRef.current}/>
            <Chat socket={socketRef.current}/>
        </>
    );
};

export default Messenger;