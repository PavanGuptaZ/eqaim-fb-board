import { useRouter } from "next/navigation"
import Button01 from "./Button01"

export default function ErrorMessage({ message }: { message: string }) {
    const router = useRouter()
    const handleClick = () => {
        router.push('/')
    }
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ fontWeight: 500, fontSize: "24px" }}>{message}</div>
            <Button01 text="Navigate to Home" BTNtype="click" type="type01" clickFunction={handleClick} />
        </div>
    )
}
