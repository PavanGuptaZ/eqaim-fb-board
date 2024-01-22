import { FilterTypes, StatusTypes } from "../home";

export interface FeedbackType {
    id: number;
    title: string;
    category: "enhancement" | "bug" | "feature" | "ui" | "ux";
    upvotes: number;
    status: "suggestion" | "planning" | "in-Progress" | "live";
    description: string;
    comments: number;
}

export interface feedbackAction {
    type: string;
    payload?: any;
}

export interface AddOrModifyType {
    type: string,
    title: string,
    category: FilterTypes,
    description: string,
    status?: StatusTypes
}

export interface feedbackDetail {
    id: number;
    title: string;
    category: FilterTypes;
    upvotes: number;
    status: StatusTypes;
    description: string;
    comments: number;
    commentsList: CommentType[] | [];
    user?: string;
    deleted: boolean;
}

export interface CommentType {
    id: number;
    content: string;
    user: UserType;
    replies: ReplaysType[] | [];
}

export interface ReplaysType {
    content: string;
    replyingTo: string;
    user: UserType;
}

interface UserType {
    _id: string
    name: string;
    userName: string;
    email: string;
    image: string;
}