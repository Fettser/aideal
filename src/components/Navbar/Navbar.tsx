import React, {ReactElement} from 'react';
import styles from './Navbar.module.css'
import {Link, useLocation} from "react-router-dom";

const Navbar = (): ReactElement => {
    const location = useLocation()
    return (
        <div className={styles.container}>
            <Link
                className={styles.link}
                style={{color: location.pathname === '/messenger' ? 'black' : '#575757'}}
                to={'/messenger'}
            >
                Chat
            </Link>
            <Link
                className={styles.link}
                style={{color: location.pathname === '/' ? 'black' : '#575757'}}
                to={'/'}
            >
                Dashboard
            </Link>
        </div>
    );
}

export default Navbar;