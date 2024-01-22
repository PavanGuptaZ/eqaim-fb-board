export interface CommentType {
    id: number;
    content: string;
    user: {
        image: string;
        name: string;
        userName: string;
    };
    replies?: ReplyType[]
}

export interface ReplyType {
    content: string;
    replyingTo: string;
    user: {
        image: string;
        name: string;
        userName: string;
    };
}

export interface UserType {
    _id?: string;
    image: string;
    name: string;
    userName: string;
}