export async function feedbackDeleteApiFunction(id: number) {
    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/feedback/delete/" + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
        })

        const dataRecieved = responce.json()
        return dataRecieved
    } catch (error) {
        return { status: 'error', message: "Fetching error" }
    }
}

export default feedbackDeleteApiFunction