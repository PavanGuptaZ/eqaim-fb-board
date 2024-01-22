"use client"
import GoBack from '@/components/GoBack';
import styles from './roadMap.module.scss';
import Button01 from '@/components/Button01';
import Upvote from '@/components/Upvote';
import { FaComment } from 'react-icons/fa6';
import { GoDotFill } from "react-icons/go";
import { useState } from 'react';
import { StatusTypes, StatusTypes2 } from '@/types/home';
import { useGetFeedbackList, useGetFeedbackListLoading } from '@/hooks/FeedbackProvider';
import { LoadingComponent } from '@/components/LoadingComponent';
import SuggessionBlock from '@/components/SuggessionBlock';
import { LoginAndRegister } from '@/components/LoginAndRegister/LoginAndRegister';
import { useGetUser } from '@/hooks/ContextProvider';
// import data from '../../assets/data.json';

export default function RoadMap() {
    const [displayList, setDisplayList] = useState<StatusTypes2>(StatusTypes2.inProgress)

    const user = useGetUser()
    const feedbackData = useGetFeedbackList()
    const feedbackLoading = useGetFeedbackListLoading()

    if (!user) {
        return <LoginAndRegister />
    }

    if (feedbackLoading) {
        return <LoadingComponent />
    }

    const classNameHelper = {
        planned: displayList === StatusTypes2.planning ? styles.active : " ",
        inProgress: displayList === StatusTypes2.inProgress ? styles.active : " ",
        live: displayList === StatusTypes2.live ? styles.active : " ",
    }

    const ListHelper = {
        planned: feedbackData && feedbackData.filter((elem) => elem.status === StatusTypes.planning),
        inProgress: feedbackData && feedbackData.filter((elem) => elem.status === StatusTypes.inProgress),
        live: feedbackData && feedbackData.filter((elem) => elem.status === StatusTypes.live),
    }
    return (
        <div className={styles.RoadMapBox}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <GoBack text='Go Back' addStyles={{ color: "#fff" }} />
                    <div className={styles.title}>Roadmap</div>
                </div>
                <div className={styles.right}>
                    <Button01 text='+ Add Feedback' type='type01' BTNtype='route' routeLink='newfeedback' />
                </div>
            </div>
            <div className={styles.bodyBox}>
                <div className={styles.viewControlBox}>
                    <div className={styles.planned + " " + classNameHelper.planned} onClick={() => setDisplayList(StatusTypes2.planning)}>Planning</div>
                    <div className={styles.inProgress + " " + classNameHelper.inProgress} onClick={() => setDisplayList(StatusTypes2.inProgress)}>In-Progress</div>
                    <div className={styles.live + " " + classNameHelper.live} onClick={() => setDisplayList(StatusTypes2.live)}>Live</div>
                </div>
                <div className={styles.titlesBox}>
                    <div className={styles.planned + " " + classNameHelper.planned}>
                        <div className={styles.head}>Planned</div>
                        <div className={styles.subText}>Ideas prioritized for research</div>
                    </div>
                    <div className={styles.inProgress + " " + classNameHelper.inProgress}
                        onClick={() => setDisplayList(StatusTypes2.inProgress)}>
                        <div className={styles.head}>In-Progress</div>
                        <div className={styles.subText}>Currently being developed</div>
                    </div>
                    <div className={styles.live + " " + classNameHelper.live}
                        onClick={() => setDisplayList(StatusTypes2.live)}>
                        <div className={styles.head}>Live</div>
                        <div className={styles.subText}>Released features</div>
                    </div>
                </div>
                <div className={styles.suggessionsList}>
                    <div className={styles.plannedList + " " + classNameHelper.planned}>
                        {ListHelper.planned?.length > 0 ? ListHelper.planned.map((ele) => {
                            return <SuggessionBlock data={ele} key={ele.id} mobile={true} view2={true} dot={true} />
                        }) : <div className={styles.nothingMessage}>Nothing to Display</div>}
                    </div>
                    <div className={styles.inProgressList + " " + classNameHelper.inProgress}>
                        {ListHelper.inProgress?.length > 0 ? ListHelper.inProgress.map((ele) => {
                            return <SuggessionBlock data={ele} key={ele.id} mobile={true} view2={true} dot={true} />
                        }) : <div className={styles.nothingMessage}>Nothing to Display</div>}
                    </div>
                    <div className={styles.liveList + " " + classNameHelper.live}>
                        {ListHelper.live?.length > 0 ? ListHelper.live.map((ele) => {
                            return <SuggessionBlock data={ele} key={ele.id} mobile={true} view2={true} dot={true} />
                        }) : <div className={styles.nothingMessage}>Nothing to Display</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
// function SuggessionBlock({ count, isLiked = false, category }: { count: number, isLiked?: boolean, category: string }) {
//     return (
//         <div className={styles.suggessionItem}>
//             <div className={styles.type}><GoDotFill /></div>
//             <div className={styles.content}>
//                 <div className={styles.heading}> Add tages for soluation</div>
//                 <div className={styles.text}>Easier to search for solutions based on a specific stack.</div>
//                 <div className={styles.category}>{category}</div>
//             </div>
//             <div className={styles.controls}>
//                 <Upvote count={count} isActive={isLiked} />
//                 <div className={styles.commentsCount}><FaComment fill='#CED7FF' />2</div>
//             </div>
//         </div>
//     )
// }
