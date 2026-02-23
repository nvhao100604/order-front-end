'use client'
import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

const Modal = ({ children, handleClick }:
    { children: ReactNode, handleClick: () => void }) => {
    useEffect(() => {
        const handleEscape = (e: any) => {
            if (e.key === 'Escape') {
                handleClick();
            }
        };

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-2">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClick}></div>
            <div className="relative rounded-2xl max-w-2xl w-full z-51 ">
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal