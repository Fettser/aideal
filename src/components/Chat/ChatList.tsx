import React, {FC, useEffect, useState} from 'react';
import ChatItem from "./ChatItem";
import styles from './Chat.module.css'
import {Socket} from "socket.io-client";

interface IChatListProps {
    socket: Socket
}

interface IChat {
    conversationId: number,
    messages: {
        unread: number,
        lastMsg: string
    }
}

type IChatResponse = {
    chats: IChat[]
}

const ChatList:FC<IChatListProps> = ({socket}) => {

    const [chats, setChats] = useState<IChat[]>([])

    useEffect(() => {
        function updateList(chats: IChat[]) {
            setChats(chats)
        }
        socket.emit('get_initial', (response: IChatResponse) => {
            console.log(response)
            setChats(response.chats)
        })
        socket.on('message_list', updateList)

        return () => {
            socket.off('message_list', updateList)
        }
    }, [])

    return (
        <div className={styles.chatList}>
            {chats.map(chat => <ChatItem key={chat.conversationId} isUnread={chat.messages.unread} name={chat.conversationId} text={chat.messages.lastMsg}/>)}
        </div>
    );
};

export default ChatList;