
export async function fetchLogout() {

    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/auth/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
        })
        const dataRevieved = await responce.json()
        return dataRevieved
    } catch (error) {
        console.log(error)
    }
}