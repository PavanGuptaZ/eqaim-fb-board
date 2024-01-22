import { FormEvent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import styles from '../../styles/feedback.module.scss';
import { FilterTypes, StatusTypes, StatusTypes2 } from '@/types/home';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddOrModifyType, feedbackDetail } from '@/types/apiElemants';
import { toast } from 'react-toastify';
import { AddandModifyFeedback } from '@/api/feedback/addandModifyFeedback';
import { FeedbackEditContext, useGetUser } from '@/hooks/ContextProvider';
import feedbackDeleteApiFunction from '@/api/feedback/feedbackDelete';
import { useRouter } from 'next/navigation';

const initialValues = {
    title: "",
    category: FilterTypes.Feature,
    status: StatusTypes.suggestion,
    description: "",
}
export interface FormValues {
    title: string;
    category: FilterTypes;
    status: StatusTypes;
    description: string;
    id?: number
    user?: string
}

export default function FeedbackForm({ formType }: { formType: string }) {
    let FeedbackContext = useContext(FeedbackEditContext)
    let user = useGetUser()
    let router = useRouter()
    let queryClient = useQueryClient()

    const [viewCategory, setViewCategory] = useState(false)
    const [viewStatus, setViewStatus] = useState(false)
    const [inputValues, setInputValues] = useState<FormValues | feedbackDetail>(() => {
        if (FeedbackContext?.editFeedback) {
            return FeedbackContext.editFeedback
        } else {
            return initialValues
        }
    })
    useEffect(() => {
        return () => {
            FeedbackContext?.setEditFeedback(null)
        }
    })

    const FilterValues: string[] = Object.values(FilterTypes)
    const StatusValues: string[] = Object.values(StatusTypes2)

    const AddandModifyFeedbackMutation = useMutation({
        mutationKey: [`form-${formType}`],
        mutationFn: (variables: AddOrModifyType) => AddandModifyFeedback(variables),
        onSuccess: (data) => {
            if (data.status == 'success') {
                queryClient.invalidateQueries({ queryKey: ['feedbackQueryList'] })
                router.push(`feedbackdetail/${data.result.id}`)
            }
        }
    })

    const DeleteFeedbackMutation = useMutation({
        mutationKey: [`form-delete-${formType}`],
        mutationFn: (variables: number) => feedbackDeleteApiFunction(variables),
        onSuccess: (data) => {
            if (data.status == 'success') {
                queryClient.invalidateQueries({ queryKey: ["feedbackQueryList"] })
                toast.info(data.message)
                router.push('/')
            }
        }
    })

    const handleCategoryChange = (value: FilterTypes) => {
        setViewCategory(false)
        setInputValues((prev) => ({ ...prev, category: value }))
    }
    const handleStatusChange = (value: StatusTypes) => {
        setViewStatus(false)
        setInputValues((prev) => ({ ...prev, status: value }))
    }
    const handleCancel = (e: FormEvent) => {
        e.preventDefault()
        setInputValues(initialValues)
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (formType === 'editing') {
            if (inputValues.title && initialValues.category && inputValues.description && initialValues.status && inputValues.description.length < 150) {
                AddandModifyFeedbackMutation.mutate({
                    type: `modify/${inputValues.id}`, title: inputValues.title,
                    category: inputValues.category,
                    description: inputValues.description,
                    status: inputValues.status
                })
            } else toast.warn("check all inputs")

        } else {
            if (inputValues.title && initialValues.category && inputValues.description && inputValues.description.length < 150) {

                AddandModifyFeedbackMutation.mutate({
                    type: "add", title: inputValues.title,
                    category: inputValues.category,
                    description: inputValues.description
                })
            } else toast.warn("check all inputs")
        }
    }
    const handleDelete = (e: FormEvent) => {
        e.preventDefault()

        if (inputValues?.id && inputValues?.user === user?._id) {
            DeleteFeedbackMutation.mutate(inputValues?.id)
        }
    }

    return (
        <form className={styles.formBox} onSubmit={(e) => handleSubmit(e as FormEvent)}>
            <div className={styles.inputBox}>
                <label className={styles.inputLabel}>
                    Feedback Title
                </label>
                <label className={styles.inputShortLabel}>
                    Add a short, description headline
                </label>
                <input className={styles.input} type="text" value={inputValues.title} placeholder='Title here'
                    onChange={(e) => setInputValues((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className={styles.inputBox}>
                <label className={styles.inputLabel}>
                    Category
                </label>
                <label className={styles.inputShortLabel}>
                    Choose a category for your feedback
                </label>
                <div className={styles.input} onClick={() => setViewCategory(!viewCategory)}>{inputValues.category}</div>
                {viewCategory &&
                    <div className={styles.optionsBox}>
                        {FilterValues.map((elem) => {
                            return <div key={elem} className={styles.optionsValue} onClick={() => handleCategoryChange(elem as FilterTypes)}>{elem}</div>
                        })}
                    </div>
                }
            </div>

            {formType === 'editing' && <div className={styles.inputBox}>
                <label className={styles.inputLabel}>
                    Updated Status
                </label>
                <label className={styles.inputShortLabel}>
                    Change feedback state
                </label>
                <div className={styles.input} onClick={() => setViewStatus(!viewStatus)}>{inputValues.status}</div>
                {viewStatus &&
                    <div className={styles.optionsBox}>
                        {StatusValues.map((elem) => {
                            if (elem == "all") return
                            return <div key={elem} className={styles.optionsValue} onClick={() => handleStatusChange(elem as StatusTypes)}>{elem}</div>
                        })}
                    </div>
                }
            </div>}

            <div className={styles.inputBox}>
                <label className={styles.inputLabel}>
                    Feedback Details
                </label>
                <label className={styles.inputShortLabel}>
                    Include any specific comments on what should be improved, added, etc.
                </label>
                <textarea className={styles.inputArea} value={inputValues.description}
                    onChange={(e) => setInputValues((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            <div className={styles.BTNBox}>
                {formType === 'editing' && inputValues?.user === user?._id && <button className={styles.formBTN + " " + styles.delete} onClick={(e) => handleDelete(e as FormEvent)}>delete</button>}
                <button className={styles.formBTN + " " + styles.cancel} onClick={(e) => handleCancel(e as FormEvent)}>cancel</button>
                <button className={styles.formBTN + " " + styles.save} type='submit' >{formType === 'editing' ? 'save changes' : 'Add FeedBack'}</button>
            </div>
        </form>
    )
}
