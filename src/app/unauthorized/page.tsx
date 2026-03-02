'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaLock } from "react-icons/fa"

const UnauthorizedPage = () => {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FDF8EE] px-4 py-8">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-orange-900/10 text-center max-w-[90%] sm:max-w-md w-full animate-appear">

                <div className="w-16 h-16 md:w-24 md:h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border-4 border-red-100/50">
                    <FaLock className="text-2xl md:text-4xl" />
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold font-nunito text-gray-800 mb-3 leading-tight">
                    Access Denied
                </h1>

                <p className="text-sm md:text-base text-gray-500 mb-8 px-2 leading-relaxed font-varela-round">
                    You do not have the necessary permissions to view this content.
                    Please switch to an authorized account or contact our support team.
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <Link
                        href="/"
                        className="w-full py-3.5 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 active:scale-95 hover:brightness-110"
                    >
                        Back to Homepage
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-3.5 md:py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl transition-all border border-gray-100 active:scale-95"
                    >
                        Go Back
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">
                        Error Code: 403 Forbidden
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedPage