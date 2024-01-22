import { useRouter } from "next/navigation";
import Upvote from "./Upvote";
import styles from './components.module.scss';
import { FaComment } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FilterTypes, StatusTypes } from "@/types/home";
import { feedbackDetail } from "@/types/apiElemants";

interface Solution {
    id: number;
    title: string;
    category: FilterTypes;
    upvotes: number;
    status: StatusTypes;
    description: string;
    comments?: number | string;
}

export default function SuggessionBlock(
    { data, isLiked = false, mobile = false, dot = false, hoverEffect = false, view2 = false, typeView }
        : { data: feedbackDetail, isLiked?: boolean, mobile?: boolean, dot?: boolean, hoverEffect?: boolean, view2?: boolean, typeView?: string }) {
    const router = useRouter()

    const handelChangePage = () => {
        if (hoverEffect || view2) {
            router.push(`/feedbackdetail/${data.id}`)
        }
    }

    let borderColor = data.status == 'planning' ? '#F49F85' : data.status == 'in-Progress' ? '#AD1FEA' : '#62BCFA'

    return (
        <div className={
            styles.suggessionItem + " " +
            (mobile ? styles.mobileFit : " ") +
            (hoverEffect ? styles.hoverEffect : " ") +
            (view2 ? styles.view2 : " ") +
            (typeView ? styles[typeView] : " ")
        } style={{ borderTop: dot ? `4px solid ${borderColor}` : "" }} >
            <Upvote count={data.upvotes} isActive={isLiked} />
            {dot && <div className={styles.type}><GoDotFill fill={borderColor} /><span>{data.status}</span></div>}
            <div className={styles.content} onClick={handelChangePage}>
                <div className={styles.heading}>{data.title}</div>
                <div className={styles.text}>{data.description}</div>
                <div className={styles.category}>{data.category}</div>
            </div>
            <div className={styles.controls}>
                <Upvote count={data.upvotes} isActive={isLiked} />
                <div className={styles.commentsCount}><FaComment fill='#CED7FF' />{data.comments}</div>
            </div>
        </div>
    )
}