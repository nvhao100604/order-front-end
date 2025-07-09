import { ReactElement } from "react"

const Modal = ({ children, handleClick }: { children: ReactElement, handleClick: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleClick}
        >
            {children}
        </div>
    )
}

export default Modal