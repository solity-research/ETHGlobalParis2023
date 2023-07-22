import { useRouter } from "next/router";
import Link from 'next/link';

const CustomNavbar = () => {

    const router = useRouter()

    const handleLogin = () => {
        router.push("/login")
    }

    const isLogin = (): boolean => {
        try{
            return localStorage.getItem("account") !== null;
        }catch{
            return false;
        }
    }

    return (
        <nav className=" border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                </a>
                <nav className="hidden gap-12 lg:flex">
                    <Link href="/credit">
                        <p className="text-lg font-semibold text-indigo-500">Learn Credit Score</p>
                    </Link>
                    <Link href="/dashboard/aave">
                        <p className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Aave</p>
                    </Link>
                    <Link href="/dashboard/compound">
                        <p className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Compound</p>
                    </Link>
                    <Link href="/dashboard/uniswap">
                        <p className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Uniswap</p>
                    </Link>
                </nav>
                <div className="hidden w-full lg:flex md:block md:w-auto" id="navbar-default">
                    <div className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        
                            {!isLogin() && <button onClick={handleLogin} type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Login</button>}
                        
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default CustomNavbar;