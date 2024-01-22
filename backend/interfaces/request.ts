export default interface AuthenticatedRequest extends Request {
    user?: object;
    cookies?: {
        REFRESH_TOKEN: string
    },
    path?: any
    headers: CustomHeaders,


}

interface CustomHeaders extends Headers {
    authorization?: string;
    Authorization?: string;
    origin?: string;
}