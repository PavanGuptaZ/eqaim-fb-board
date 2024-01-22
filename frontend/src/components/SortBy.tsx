import { SortTypes } from "@/types/home";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styles from './components.module.scss'
import { TiTick } from "react-icons/ti";

interface SortByProps {
    sort: string;
    setSort: (value: SortTypes) => void
}

export default function SortBy({ sort, setSort }: SortByProps) {
    const [showOptions, setShowOptions] = useState(false)
    const sortValues: string[] = Object.values(SortTypes)

    const handleClose = () => {
        setShowOptions(false)
    }
    const handleClick = (e: React.MouseEvent, value: SortTypes) => {
        e.stopPropagation()
        setSort(value)
        handleClose()
    }

    return (
        <div className={styles.SortBox}>
            <div className={styles.sortHeading}>Sort by: </div>
            <div className={styles.sortSelected} onClick={(e) => setShowOptions(!showOptions)}>
                {sort}{<IoIosArrowDown />}
            </div>
            <div className={styles.sortOptions}>
                {showOptions && sortValues.map((elem) => {
                    return <li key={elem} className={styles.sortItem + " " + (elem == sort ? styles.activeSort : "")} onClick={(e) => handleClick(e, elem as SortTypes)}>
                        {elem} {elem == sort ? <TiTick className={styles.tickIcon} /> : ""}</li>
                })}
            </div>
        </div>
    )
}
