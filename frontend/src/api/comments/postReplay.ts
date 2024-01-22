
export async function AddReplayFeedback(variables: { commentId: number, content: string, replyingTo: string }) {
    let { commentId, content, replyingTo } = variables

    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/comment/replay/" + commentId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ content, replyingTo })
        })
        const dataRevieved = await responce.json()
        return dataRevieved
    } catch (error) {
        console.log(error)
    }
}
