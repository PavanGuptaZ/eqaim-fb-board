"use client"
import GoBack from '@/components/GoBack';
import styles from './feedbackdetail.module.scss';
import Button01 from '@/components/Button01';
import SuggessionBlock from '@/components/SuggessionBlock';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { CommentType, ReplaysType } from '@/types/apiElemants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import feedbackDetailsApiFunction from '@/api/feedback/feedbackDetails';
import { FeedbackEditContext, useGetUser } from '@/hooks/ContextProvider';
import { LoginAndRegister } from '@/components/LoginAndRegister/LoginAndRegister';
import { feedbackDetail } from '@/types/apiElemants';
import { LoadingComponent } from '@/components/LoadingComponent';
import { useRouter } from 'next/navigation';
import { AddCommentFeedback } from '@/api/comments/postComment';
import { toast } from 'react-toastify';
import { AddReplayFeedback } from '@/api/comments/postReplay';
import ErrorMessage from '@/components/ErrorMessage';

export default function Feedbackdetail({ params }: { params: { id: number } }) {
    const [feedbackData, dispatchData] = useReducer<React.Reducer<feedbackDetail | null, { type: string, payload?: {} }>>(feedbackReducer, null)
    const user = useGetUser()
    let FeedbackContext = useContext(FeedbackEditContext)

    const router = useRouter()

    const feedbackDetailQuery = useQuery({
        queryKey: [`feedbackDetails-${params.id}`],
        queryFn: () => feedbackDetailsApiFunction(params.id),
        enabled: user !== null
    })
    useEffect(() => {
        if (feedbackDetailQuery.data?.status == "success") {
            dispatchData({ type: 'addData', payload: { ...feedbackDetailQuery.data.feedbacks, commentsList: feedbackDetailQuery.data.comments } })
        }
    }, [feedbackDetailQuery.data])

    const handleEditFeedback = () => {
        FeedbackContext?.setEditFeedback(feedbackData)
        router.push('/editfeedback')
    }

    if (!user) {
        return <LoginAndRegister />
    } else if (feedbackDetailQuery.isLoading) {
        return <LoadingComponent />
    } else if (feedbackDetailQuery.data.status == "error") {
        return <ErrorMessage message={feedbackDetailQuery.data.message} />
    } else if (feedbackDetailQuery.isError) {
        return <ErrorMessage message={`SomeThing went wrong with fetching`} />
    }
    return (
        <div className={styles.FeedbackdetailBox}>
            <div className={styles.heading}>
                <GoBack text='Go Back' />
                <Button01 text='Home' type={'type01'} BTNtype='route' routeLink={'/'} />
                {feedbackData?.user == user._id && <Button01 text='Edit Feedback' type={'type02'} BTNtype='click' clickFunction={handleEditFeedback} />}
            </div>
            {feedbackData !== null && <SuggessionBlock data={feedbackData} isLiked={false} mobile={true} />}
            <div className={styles.commentsBox}>
                <div className={styles.CommentsHead}>{feedbackData?.comments} Comments</div>
                <div className={styles.commentList}>
                    {feedbackData?.commentsList?.map((elem) => {
                        return <CommentBlock data={elem} key={elem.id} feedbackLoading={feedbackDetailQuery.isFetching} feedbackDataId={params.id} />
                    })}
                </div>
            </div>
            <AddComment data={feedbackData} feedbackLoading={feedbackDetailQuery.isFetching} />
        </div>
    )
}


function CommentBlock({ data, feedbackDataId, feedbackLoading }: { data: CommentType, feedbackDataId: string | number, feedbackLoading: boolean }) {
    const [addReplay, setAddReplay] = useState({ replyingTo: "", showBlock: false })
    const handleReplay = () => {
        setAddReplay({ replyingTo: data.user.userName, showBlock: true })
    }

    return (
        <div className={styles.CommentBlock}>
            <div className={styles.Comment}>
                <div className={styles.image}>
                    <img src={process.env.NEXT_PUBLIC_BACKEND_LINK + data.user.image} alt='image' style={{ borderRadius: "50%", width: "100%", height: "100%" }} />
                </div>
                <div className={styles.content}>
                    <div className={styles.details}>
                        <div className={styles.personalDetails}>
                            <div className={styles.name}>{data.user.name}</div>
                            <div className={styles.username}>@{data.user.userName}</div>
                        </div>
                        <div className={styles.replayBTN} onClick={handleReplay}>
                            replay
                        </div>
                    </div>
                    <div>
                        {data.content}
                    </div>
                </div>
            </div>
            <div className={styles.replayList}>
                {data.replies && data.replies.map((elem, i) => {
                    return <ReplayBlock key={i} data={elem} setAddReplay={setAddReplay} />
                })}
            </div>
            {addReplay.showBlock && <AddReplay addReplay={addReplay} setAddReplay={setAddReplay} feedbackLoading={feedbackLoading} commentDetails={data} feedbackDataId={feedbackDataId} />}
        </div>
    )
}
function ReplayBlock({ data, setAddReplay }: { data: ReplaysType, setAddReplay: React.Dispatch<React.SetStateAction<{ replyingTo: string, showBlock: boolean }>> }) {
    const handleReplay = () => {
        setAddReplay({ replyingTo: data.user.userName, showBlock: true })
    }
    return (
        <div className={styles.ReplayBlock}>
            <div className={styles.Replay}>
                <div className={styles.image}>
                    <img src={process.env.NEXT_PUBLIC_BACKEND_LINK + data.user.image} alt='image' style={{ borderRadius: "50%", width: "100%", height: "100%" }} />
                </div>
                <div className={styles.content}>
                    <div className={styles.details}>
                        <div className={styles.personalDetails}>
                            <div className={styles.name}>{data.user.name}</div>
                            <div className={styles.username}>@{data.user.userName}</div>
                        </div>
                        <div className={styles.replayBTN} onClick={handleReplay}>
                            replay
                        </div>
                    </div>
                    <div>
                        <span className={styles.replyingTo}>{`@${data.replyingTo} `}</span>{data.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AddComment({ data, feedbackLoading }: { data: feedbackDetail | null, feedbackLoading: boolean }) {
    const [commentText, setCommentText] = useState<string>("")

    const queryClient = useQueryClient()

    let value = 250 - (commentText?.length ?? 0)

    const AddCommentMutation = useMutation({
        mutationKey: ['addComment'],
        mutationFn: (variables: { feedbackId: number, content: string }) => AddCommentFeedback(variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`feedbackDetails-${data?.id}`] }).then(() => {
                setCommentText("")
            })
        }
    })
    const handleAddComment = () => {
        if (AddCommentMutation.isPending || feedbackLoading) return toast.warn('Wait Loading')
        if (value >= 0 && value <= 240) {
            if (data?.id) {
                AddCommentMutation.mutate({ feedbackId: data?.id, content: commentText })
            }
        } else toast.warn('Comment is under 10 to 250 characters')
    }

    return (
        <div className={styles.AddCommentBlock}>
            <div className={styles.head}>Add Comment</div>
            <textarea className={styles.textArea} placeholder='Type your comment here'
                value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <div className={styles.controls}>
                <div className={value < 0 ? styles.brown : ""}>{value} characters left</div>
                <Button01 text='Post Comment' type='type01' BTNtype='click' clickFunction={handleAddComment} />
            </div>
        </div>
    )
}

function AddReplay({ addReplay, feedbackDataId, commentDetails, feedbackLoading, setAddReplay }:
    {
        addReplay: { replyingTo: string, showBlock: boolean }, commentDetails: CommentType, feedbackLoading: boolean,
        setAddReplay: React.Dispatch<React.SetStateAction<{ replyingTo: string, showBlock: boolean }>>, feedbackDataId: string | number
    }) {
    const [commentText, setCommentText] = useState<any>()
    const queryClient = useQueryClient()

    let value = 250 - (commentText?.length ?? 0)

    const AddReplayMutation = useMutation({
        mutationKey: ['addReplay'],
        mutationFn: (variables: { commentId: number, content: string, replyingTo: string }) => AddReplayFeedback(variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`feedbackDetails-${feedbackDataId}`] }).then(() => {
                setAddReplay({ replyingTo: "", showBlock: false })
            })
        }
    })
    const handleAddComment = () => {
        if (AddReplayMutation.isPending || feedbackLoading) return toast.warn('Wait Loading')
        if (value >= 0 && value <= 240) {
            if (addReplay.replyingTo) {
                AddReplayMutation.mutate({ commentId: commentDetails.id, content: commentText, replyingTo: addReplay.replyingTo })
            }
        } else toast.warn('Replay is under 10 to 250 characters')
    }
    return (
        <div className={styles.AddReplayBlock}>
            <textarea className={styles.textArea} placeholder='Type your Replay here'
                value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <div className={styles.controls}>
                <Button01 text='Post Replay' type='type01' BTNtype='click'
                    clickFunction={handleAddComment} />
            </div>
        </div>
    )
}

function feedbackReducer(state: feedbackDetail | null, action: { type: string, payload?: {} }) {

    switch (action.type) {
        case "addData":
            return action.payload as feedbackDetail | null
        case "removeData":
            return null
        default:
            return state;
    }
}