import React, {FC, HTMLProps} from 'react';
import styles from '../../styles/Input.module.css'

const Input:FC<HTMLProps<HTMLTextAreaElement>> = (props) => {
    return (
        <textarea {...props} placeholder='Введите свое сообщение...' className={styles.input}/>
    );
};

export default Input;