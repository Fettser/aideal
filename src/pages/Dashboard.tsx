import React, {ReactElement, useEffect, useState} from 'react';
import styles from '../styles/Dashboard.module.css'
import Chart from 'react-apexcharts'

interface Response {
    request_type?: {
        [key: string] : number
    }
    support_feedback?: {
        [key: number]: number
    }
    user_feedback?: {
        [key: number]: number
    }
}

const Dashboard = (): ReactElement => {

    const [data, setData] = useState<Response>({})

    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await fetch('https://aa1d-185-16-137-141.ngrok-free.app/stat')
                return await resp.json()
            } catch (e) {
                return e
            }
        }
        fetchData().then(data => setData(data)).catch(e => console.log(e))
    }, [])
    const usesMarks = [0, 0, 0, 0, 0]
    console.log(Object.entries(data.user_feedback ? data.user_feedback : {}))
    Object.entries(data.user_feedback ? data.user_feedback : {}).forEach(item => {
        if (Number(item[0] + 1))
        usesMarks[Number(item[0]) + 1] = item[1]
    })
    const supportMarks = [0, 0, 0, 0, 0]
    Object.entries(data.support_feedback ? data.support_feedback : {}).forEach(item => {
        if (Number(item[0] + 1)) {
            supportMarks[Number(item[0]) + 1] = item[1]
        }
    })
    // console.log(supportMarks)
    return (
        <div className={styles.container}>
            <Chart
                type={"donut"}
                series={usesMarks}
                options={
                    {
                        title: {text: 'Оценки клиентов', align: 'center'},
                        labels: ['1', '2', '3', '4', '5'],
                        colors: ['#ff4560', '#FF7B3D', '#feb019', '#7FCA58', '#00e396']
                    }
                }
            />
            <Chart
                type={"donut"}
                series={supportMarks}
                options={
                    {
                        title: {text: 'Оценки операторов', align: 'center'},
                        labels: ['1', '2', '3', '4', '5'],
                        colors: ['#ff4560', '#FF7B3D', '#feb019', '#7FCA58', '#00e396']
                    }
                }
            />
            <Chart
                type={'bar'}
                options={{
                    xaxis: {
                        categories: [...Object.keys(data.request_type ? data.request_type : {})]
                    },
                    title: {text: 'Обращения по темам', align: 'center'}
                }}
                series={[{name: 'Обращения по темам', data: [...Object.values(data.request_type ? data.request_type : {})]}]}
            />
        </div>
    );
};

export default Dashboard;