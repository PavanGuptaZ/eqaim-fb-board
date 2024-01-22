import styles from './components.module.scss';
import { FaChevronUp } from "react-icons/fa6";
import upIcon from '../assets/shared/icon-arrow-up.svg'
import Image from 'next/image';

export default function Upvote({ count, isActive }: { count: number, isActive: boolean }) {
    return (
        <div className={styles.upVoteBox + " " + (isActive ? styles.active : "")}>
            <FaChevronUp fill={isActive ? "#fff" : "#000"} />
            <div className={styles.countValue}>
                {count}
            </div>
        </div>
    )
}
