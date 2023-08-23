import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

const Layout = ({ children }) => {
    return (
        <>
            <nav className="flex justify-center space-x-12 py-4 px-24 bg-sky-600 text-teal-50">
                <Link href={"/"}>Home</Link>
                <Link href={"/dashboard"}>Orders</Link>
            </nav>

            <main
                className={`flex min-h-screen flex-col items-center bg-sky-900 justify-between p-24 ${inter.className}`}
            >
                {children}
            </main>
        </>
    )
}

export default Layout
