import React, {FC} from 'react';
import styles from './Chat.module.css'
import {useSearchParams} from "react-router-dom";

export interface IChatItemProps {
    name: number
    text: string,
    isUnread: number
}

const ChatItem:FC<IChatItemProps> = ({name, text, isUnread}) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const onClick = () => {
        if (searchParams.get('chat') !== String(name)) {
            setSearchParams(params => {
                params.set('chat', String(name))
                return params
            })
        }
    }

    return (
        <div className={styles.chatItem} onClick={onClick}>
            <div className={styles.chatItemBody}>
                <p className={styles.chatItemName}>{name}</p>
                <p className={styles.chatItemText}>{text}</p>
            </div>
            {isUnread ? <div className={styles.indicator}>
                <p>{isUnread}</p>
            </div> : null}
        </div>
    );
};

export default ChatItem;