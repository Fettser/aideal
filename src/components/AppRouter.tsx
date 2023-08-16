import React, {ReactElement} from 'react'
import {Routes, Route} from "react-router-dom";
import Messenger from "../pages/Messenger";
import Dashboard from "../pages/Dashboard";
import styles from '../styles/AppRouter.module.css'

const AppRouter = (): ReactElement => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path={'/'} element={<Dashboard/>}/>
                <Route path={'/messenger'} element={<Messenger/>}/>
            </Routes>
        </div>
    )
}

export default AppRouter