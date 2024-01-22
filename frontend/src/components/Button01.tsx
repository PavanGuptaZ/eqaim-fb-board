import { useRouter } from 'next/navigation';
import styles from './components.module.scss';
import { FormEvent } from 'react';

export default function Button01({
    text, BTNtype, routeLink, clickFunction, type, addStyles
}:
    {
        text: string,
        type: string,
        BTNtype: string,
        routeLink?: string,
        clickFunction?: () => void,
        addStyles?: object
    }) {
    const router = useRouter()
    const handleClick = (e: FormEvent) => {
        e.preventDefault()

        if (BTNtype === 'route') {
            if (routeLink) router.push(routeLink)
        } else if (BTNtype === 'click') {
            if (clickFunction) clickFunction()
        }
    }
    return (
        <button className={styles.Button01 + " " + styles[type]} style={{ ...addStyles }}
            onClick={(e) => handleClick(e)}>{text}</button>
    )
}
