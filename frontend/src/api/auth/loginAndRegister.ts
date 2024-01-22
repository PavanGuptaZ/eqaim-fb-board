
export async function fetchLoginAndRegister(type: string, data: { name: string, email: string, password: string, userName: string }) {

    try {
        const responce = await fetch(process.env.NEXT_PUBLIC_BACKEND_LINK + "/auth/" + type, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
                userName: data.userName
            })
        })
        const dataRevieved = await responce.json()
        return dataRevieved
    } catch (error) {
        console.log(error)
    }
}