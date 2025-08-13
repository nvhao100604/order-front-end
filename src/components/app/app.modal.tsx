import { ReactElement } from "react"

const Modal = ({ children, handleClick }: { children: ReactElement, handleClick: () => void }) => {
    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClick}></div>
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 z-51">
                {children}
            </div>
        </div>
    )
}

export default Modal