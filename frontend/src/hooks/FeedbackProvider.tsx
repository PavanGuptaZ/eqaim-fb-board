"use client"
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { FeedbackType, feedbackAction, feedbackDetail } from '../types/apiElemants/index';
import { useQuery } from '@tanstack/react-query';
import feedbackApiFunction from '@/api/feedback/feedback';
import { useGetUser } from './ContextProvider';

interface FeedbackContextValue {
  feedbackList: feedbackDetail[];
  dispatchList: React.Dispatch<feedbackAction>;
  feedbackLoading: boolean;
}

export const FeedbackContext = createContext<FeedbackContextValue | null>(null)


export default function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbackList, dispatchList] = useReducer(feedbackReducer, [])
  const user = useGetUser()

  const feedbackQuery = useQuery({
    queryKey: ['feedbackQueryList'],
    queryFn: () => feedbackApiFunction(),
    enabled: !!user
  })

  useEffect(() => {
    if (feedbackQuery.data?.status === "success") {
      dispatchList({ type: 'addFeedback', payload: feedbackQuery.data.list })
    } else {
      dispatchList({ type: 'removeFeedback' })
    }
  }, [feedbackQuery.data, feedbackQuery.isError])


  return (
    <>
      <FeedbackContext.Provider value={{ feedbackList, dispatchList, feedbackLoading: feedbackQuery.isLoading }}>
        {children}
      </FeedbackContext.Provider>
    </>
  )
}

export function feedbackReducer(state: feedbackDetail[], action: feedbackAction) {
  const { type, payload } = action

  switch (type) {
    case "addFeedback":
      return payload || null
    case "removeFeedback":
      return null
    default:
      return state;
  }
}

export function useGetFeedbackList() {
  let { feedbackList } = useContext(FeedbackContext as React.Context<FeedbackContextValue>)
  return feedbackList
}

export function useGetFeedbackListLoading() {
  let { feedbackLoading } = useContext(FeedbackContext as React.Context<FeedbackContextValue>)
  return feedbackLoading
}
