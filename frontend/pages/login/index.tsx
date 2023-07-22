import { useEffect, useState } from "react";
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const formatBalance = (rawBalance: string) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
    return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
    const chainIdNum = parseInt(chainIdHex)
    return chainIdNum
}

const Login = () => {
    const [hasProvider, setHasProvider] = useState<boolean | null>(null)
    const initialState = { accounts: [], balance: "", chainId: "" }
    const [wallet, setWallet] = useState(initialState)
    const [otpCpde, setOtpCode] = useState("")
    const [validOtpCode,setValidOtpCode] = useState("")
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [stepNumber, setStepNumber] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [wordCoinAddress,setWordCoinAddress] = useState("")

    const router = useRouter()

    const onSuccess = (data:ISuccessResult) => {
        fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((_) => {
                localStorage.setItem("account",wallet.accounts[0])
                router.push("/credit")
                // Handle the response data
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle the error
            });
            setStepNumber(value => value + 1)
    }

    useEffect(() => {
        const refreshAccounts = (accounts: any) => {
            if (accounts.length > 0) {
                updateWallet(accounts)
            } else {
                // if length 0, user is disconnected
                setWallet(initialState)
            }
        }

        const refreshChain = (chainId: any) => {
            setWallet((wallet) => ({ ...wallet, chainId }))
        }

        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true })
            setHasProvider(Boolean(provider))

            if (provider) {
                const accounts = await window.ethereum.request(
                    { method: 'eth_accounts' }
                )
                refreshAccounts(accounts)
                window.ethereum.on('accountsChanged', refreshAccounts)
                window.ethereum.on("chainChanged", refreshChain)
            }
        }

        getProvider()

        return () => {
            window.ethereum?.removeListener('accountsChanged', refreshAccounts)
            window.ethereum?.removeListener("chainChanged", refreshChain)
        }
    }, [])

    const updateWallet = async (accounts: any) => {
        const balance = formatBalance(await window.ethereum!.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
        }))
        const chainId = await window.ethereum!.request({
            method: "eth_chainId",
        })
        setWallet({ accounts, balance, chainId })
    }

    const handleConnect = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setIsConnecting(true)
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
            .then((accounts: []) => {
                setError(false)
                updateWallet(accounts)
                sessionStorage.setItem("account", wallet.accounts[0] as string)
            })
            .catch((err: any) => {
                setError(true)
                setErrorMessage(err.message)
            })
        setIsConnecting(false)
    }

    const verifyYourself = () => {
        if (stepNumber < 4) {
            if (stepNumber == 0) {
                const data = {
                    Pkey: wallet.accounts[0],
                };
                fetch("/api/otp", {
                    method: "POST",
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setValidOtpCode(data);
                        // Handle the response data
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        // Handle the error
                    });
                    setStepNumber(value => value + 1)
            }else if(stepNumber == 1){
                if(validOtpCode == otpCpde){
                    setStepNumber(value => value + 1)
                }else{
                }
            }
        }
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-lg">
                <ol className="flex mb-10 items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                    <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            {stepNumber > 0 &&
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            }
                            <span className="mr-2">1</span>
                            Personal <span className="hidden sm:inline-flex sm:ml-2">Info</span>
                        </span>
                    </li>
                    <li className="flex md:w-full items-center">
                        <span className={`flex ${stepNumber > 1 ? 'text-blue-600 dark:text-blue-500' : ''}flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500`}>
                            {stepNumber > 1 &&
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            }
                            <span className="mr-2">2</span>
                            OTP <span className="hidden sm:inline-flex sm:ml-2">Info</span>
                        </span>
                    </li>
                    <li className="flex items-center">
                        <span className={`flex ${stepNumber > 3 ? 'text-blue-600 dark:text-blue-500' : ''}flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500`}>
                            {stepNumber > 2 &&
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            }
                            <span className="mr-2">3</span>
                            Verification
                        </span>
                    </li>
                </ol>
                {
                    stepNumber == 0 &&
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div>
                                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Wallet Address</label>
                                <input value={wallet.accounts[0]} disabled name="password" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>

                            <button onClick={handleConnect} className="block rounded-lg bg-cyan-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Connect Wallet</button>
                            <div className="relative flex items-center justify-center">
                                <span className="absolute inset-x-0 h-px bg-gray-300"></span>
                                <span className="relative bg-white px-4 text-sm text-gray-400">
                                    {loading && <p>Loading...</p>}
                                    {!loading && <p>Start to jurney</p>}
                                </span>
                            </div>
                            <button onClick={verifyYourself} className="block rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Next</button>
                        </div>
                }
                {
                    stepNumber == 1 &&
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div>
                                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">OTP Code</label>
                                <input value={otpCpde} onChange={(event) => setOtpCode(event.target.value)} name="otp" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                            <div className="relative flex items-center justify-center">
                                <span className="absolute inset-x-0 h-px bg-gray-300"></span>
                                <span className="relative bg-white px-4 text-sm text-gray-400">
                                    {loading && <p>Loading...</p>}
                                    {!loading && <p>Start to jurney</p>}
                                </span>
                            </div>
                            <button onClick={verifyYourself} className="block rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Next</button>
                        </div>
                }
                {
                    stepNumber == 2 &&
                    <IDKitWidget
                        app_id= "app_staging_ef8611b8b7fc8451667562fbdae8c2e3"// obtained from the Developer Portal
                        action="login" // this is your action name from the Developer Portal
                        onSuccess={onSuccess} // callback when the modal is closed
                        credential_types={[CredentialType.Orb,CredentialType.Phone]} // optional, defaults to ['orb']
                    >
                        {({ open }) => 
                            <div className="flex flex-col gap-4 p-4 md:p-8">
                                <button onClick={open} className="block rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Verify with World ID</button>
                            </div>
                        }
                    </IDKitWidget>
                }
            </div>
        </div>
    )
}

export default Login;