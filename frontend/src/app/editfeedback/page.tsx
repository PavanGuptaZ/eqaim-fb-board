"use client"
import GoBack from '@/components/GoBack';
import styles from '../../styles/feedback.module.scss';
import featureIcon from '../../assets/shared/icon-edit-feedback.svg'
import Image from 'next/image';
import FeedbackForm from '@/components/Form/FeedbackForm';
import { useGetUser } from '@/hooks/ContextProvider';
import { LoginAndRegister } from '@/components/LoginAndRegister/LoginAndRegister';

export default function Editfeedback() {
    const user = useGetUser()

    if (!user) {
        return <LoginAndRegister />
    }
    return (
        <div className={styles.newfeedback}>
            <div className={styles.newfeedbackBox}>
                <GoBack text='Go Back' />
                <div className={styles.content}>
                    <Image className={styles.featureIcon} src={featureIcon} alt='featureIcon' width={50} />
                    <div className={styles.Heading}>
                        Editing
                    </div>
                    <FeedbackForm formType='editing' />
                </div>
            </div>
        </div>
    )
}
