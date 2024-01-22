import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import styles from './components.module.scss';

export default function GoBack({ text, addStyles }: { text: string, addStyles?: object }) {
    const router = useRouter()
    const handleClick = () => {
        router.back()
    }
    return (
        <button className={styles.GoBack} style={{ ...addStyles }}
            onClick={handleClick}><FaChevronLeft /> {text}</button>
    )
}
