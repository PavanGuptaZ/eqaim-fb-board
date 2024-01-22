"use client"
import GoBack from '@/components/GoBack';
import styles from '../../styles/feedback.module.scss';
import featureIcon from '../../assets/shared/icon-new-feedback.svg'
import Image from 'next/image';
import FeedbackForm from '@/components/Form/FeedbackForm';
import { LoginAndRegister } from '@/components/LoginAndRegister/LoginAndRegister';
import { useGetUser } from '@/hooks/ContextProvider';

export default function Feedbackdetail() {
    const user = useGetUser()

    if (!user) {
        return <LoginAndRegister type='login' />
    }
    return (
        <div className={styles.newfeedback}>
            <div className={styles.newfeedbackBox}>
                <GoBack text='Go Back' />
                <div className={styles.content}>
                    <Image className={styles.featureIcon} src={featureIcon} alt='featureIcon' width={50} />
                    <div className={styles.Heading}>
                        Create New Feedback
                    </div>
                    <FeedbackForm formType={'new'} />
                </div>
            </div>
        </div>
    )
}
