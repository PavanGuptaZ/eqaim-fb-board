
export async function AddCommentFeedback(variables: { feedbackId: number, content: string }) {
    let { feedbackId, content } = variables
    console.log(content)
    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/comment/" + feedbackId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ content })
        })
        const dataRevieved = await responce.json()
        return dataRevieved
    } catch (error) {
        console.log(error)
    }
}
