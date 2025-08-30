
const LoadingBox = () => {
    return (
        <div className="w-full h-full place-items-center justify-center flex m-auto">
            <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 border-3 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-black text-md animate-pulse">Loading...</p>
            </div>
        </div>
    )
}

export default LoadingBox