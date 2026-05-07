import React from 'react'
import style from './Box.module.css'
import { data } from 'react-router-dom'
const Box = ({number,name}) => {
    const BoxData = [
        {
            number: "10,000+",
            data: "Active User"
        },
        {
            number: "50,000,000+",
            data: "Total Volume"
        },
        {
            number: "99.9%",
            data: "UpTime"
        },
        {
            number: "12+",
            data: "Country"
        }
    ]
    return (
        <>
            <div className={style.container}>
                <div className={style.Bcontent}>
                   {BoxData.map((e,index)=> (
                   <div key={e.index} className={style.Box}>
                     <h2>{e.number}</h2>
                     <p>{e.data}</p>
                    </div>
                   ))  }
                </div>
            </div>

        </>
    )
}

export default Box