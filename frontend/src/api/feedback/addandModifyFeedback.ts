import { AddOrModifyType } from "@/types/apiElemants";

export async function AddandModifyFeedback(variables: AddOrModifyType) {
    let { type, ...data } = variables

    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/feedback/" + type, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        const dataRevieved = await responce.json()
        return dataRevieved
    } catch (error) {
        console.log(error)
    }
}
