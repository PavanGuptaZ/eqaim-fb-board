"use client"
import { UserType } from '@/types/objects';
import { useQuery } from '@tanstack/react-query';
import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useReducer, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshApiFunction } from '../api/refresh/refresh'
import { feedbackDetail } from '@/types/apiElemants';


interface ContextProps {
    user: UserType | null;
    DispatchUser: Dispatch<UserAction>;
    userLoading: boolean
}
interface FeedbackContextProps {
    editFeedback: feedbackDetail | null;
    setEditFeedback: React.Dispatch<React.SetStateAction<feedbackDetail | null>>;
}
interface UserAction {
    type: string;
    payload?: UserType;
}

export const UserContext = createContext<ContextProps | null>(null)
export const FeedbackEditContext = createContext<FeedbackContextProps | null>(null)

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const [user, DispatchUser] = useReducer<React.Reducer<UserType | null, UserAction>>(userReducer, null)
    const [editFeedback, setEditFeedback] = useState<feedbackDetail | null>(null)
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: () => refreshApiFunction()
    })

    useEffect(() => {
        if (userQuery.data?.status === "success") {
            DispatchUser({ type: 'addUser', payload: userQuery.data.user })
        } else {
            DispatchUser({ type: 'removeUser' })
        }
    }, [userQuery.data])


    return (
        <UserContext.Provider value={{ user, DispatchUser, userLoading: userQuery.isLoading }}>
            <FeedbackEditContext.Provider value={{ editFeedback, setEditFeedback }}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    theme="light"
                />
                {children}
            </FeedbackEditContext.Provider>
        </UserContext.Provider>
    )
}

export function userReducer(state: UserType | null, action: UserAction) {

    switch (action.type) {
        case "addUser":
            return action.payload || null
        case "removeUser":
            return null
        default:
            return state;
    }
}

export function useGetUser() {
    let { user } = useContext(UserContext as React.Context<ContextProps>)
    return user
}
export function useUserLoading() {
    let { userLoading } = useContext(UserContext as React.Context<ContextProps>)
    return userLoading
}