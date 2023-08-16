import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import Input from "./Input";
import styles from './Chat.module.css'
import buttonStyles from '../../styles/Button.module.css'
import {useSearchParams} from "react-router-dom";
import {Socket} from "socket.io-client";

type MessageType = {
    text: string,
    time: number,
    role: string,
    photo?: string
}

type JoinResponse = {
    messages: MessageType[],
    replyVariants: string[]
}

interface IChatProps {
    socket: Socket
}

interface IMessagesProps {
    messages: MessageType[]
    isEnd: boolean
    onEnd: (mark: number) => void
}

interface IMessageProps {
    message: MessageType
}

const Chat:FC<IChatProps> = ({socket}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [messages, setMessages] = useState<MessageType[]>([])
    const [message, setMessage] = useState<string>('')
    const [replyVariants, setReplyVariants] = useState<string[]>([])
    const [isEnd, setIsEnd] = useState(false)

    const chat = searchParams.get('chat')

    useEffect(() => {
        if (!Number(chat)) return
        socket.emit('read_message')
    }, [messages])

    useEffect(() => {
        if (!Number(chat)) return

        setReplyVariants([])

        socket.emit('join_conversation', Number(chat), (response: JoinResponse) => {
            setMessages(response.messages)
        })

        function onUpdateMessage(data: MessageType) {
            setMessages(prevState => [...prevState, data])
        }

        function onGetVariants(data: string[]) {
            setReplyVariants(data.map(variant => variant.replaceAll('\n', '<br/>')))
        }

        socket.on('message:update', onUpdateMessage)
        socket.on('send_variants', onGetVariants)

        return () => {
            socket.emit('leave_room', chat)
            socket.off('message:update', onUpdateMessage)
            socket.off('send_variants', onGetVariants)
        }
    }, [chat])

    const onClick = () => {
        if (chat && message.trim()) {
            socket?.emit('send_message', {
                text: message,
                photo: undefined,
                conversationId: Number(chat)
            })
            setReplyVariants([])
            setMessage('')
        }
    }

    const onChangeReplyVariant = (text: string) => {
        socket?.emit('send_message', {
            text: text,
            photo: undefined,
            conversationId: Number(chat)
        })
        setReplyVariants([])
    }

    function endAndSubmitMark(mark: number) {
        socket?.emit('end_conversation', mark)
        setSearchParams(params => {
            params.delete('chat')
            return params
        })
        setIsEnd(false)
        setMessages([])
        setReplyVariants([])
    }

    return (
        <div className={styles.chat}>
            <MessageArea messages={messages} isEnd={isEnd} onEnd={endAndSubmitMark}/>
            {Number(chat) && !isEnd ? (
                <div style={{display: 'flex', gap: 10}}>
                    <Input value={message} onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}/>
                    <div style={{display: "flex", flexDirection: 'column', gap: 10}}>
                        <button className={`${buttonStyles.btn} ${buttonStyles.submit}`} onClick={onClick}>Отправить</button>
                        <button className={`${buttonStyles.btn} ${buttonStyles.cancel}`} onClick={() => setIsEnd(true)}>Завершить</button>
                    </div>
                </div>
            ) : null}
            {replyVariants.length ? <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                Варианты ответа от GPT:
                {replyVariants.map(variant => {
                    return <div key={variant} onClick={() => onChangeReplyVariant(variant)} className={styles.chatItem}>{variant}</div>
                })}
            </div> : null}
        </div>
    );
};

const Message:FC<IMessageProps> = ({message}) => {
    return (
        <div className={styles.message} style={{alignSelf: (message.role === 'support' ? 'flex-end' : 'flex-start')}}>
            <p className={styles.role}>{message.role}</p>
            {message.photo ? <img src={message.photo}/> : null}
            <p className={styles.text}>{message.text}</p>
        </div>
    )
}

const MessageArea:FC<IMessagesProps> = ({messages, isEnd, onEnd}) => {

    const endRef = useRef<HTMLDivElement | null>(null)
    const buttons: [number, string][] = [[1, '#ff4560'], [2, '#FF7B3D'], [3, '#feb019'], [4, '#7FCA58'], [5, '#00e396']]

    useEffect(() => {
        endRef.current?.scrollIntoView()
    }, [messages])

    if (isEnd) {
        return <div style={{alignItems: 'center', justifyContent: 'center'}} className={styles.messages}>
            <div style={{alignSelf: 'center'}}>Оцените диалог</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 5}}>
                {buttons.map((button) => {
                    return <button key={button[0]} className={buttonStyles.mark} style={{backgroundColor: button[1]}} onClick={() => onEnd(button[0])}>{button[0]}</button>
                })}
            </div>
        </div>
    }

    return (
        <div className={styles.messages} style={{justifyContent: !messages.length ? 'center' : 'flex-start'}}>
            {messages.length ?
                messages.map(message => <Message key={message.time} message={message}/>) :
                <div style={{alignSelf: 'center'}}>Выберите чат</div>
            }
            <div ref={endRef} style={{height: 0}}/>
        </div>
    )
}

export default Chat;