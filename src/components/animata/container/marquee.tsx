import { CSSProperties, MouseEvent, RefObject } from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    vertical?: boolean;
    repeat?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    applyMask?: boolean;
    ref?: RefObject<HTMLDivElement | null>;
    onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseUp?: () => void;
    onMouseLeave?: () => void;
    onMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
}

function Marquee({
    children,
    vertical = false,
    repeat = 10,
    pauseOnHover = false,
    reverse = false,
    className,
    applyMask = true,
    ref, // Đây là ref bạn truyền từ MarqueeBox vào
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    ...props
}: MarqueeProps) {
    return (
        // 1. THẺ NGOÀI CÙNG: Làm khung cố định, không được cuộn ở đây
        <div
            className={`group relative flex h-full w-full overflow-hidden ${className ? className : ""}`}
            style={{ '--duration': '0s', '--gap': '0.75rem', gap: 'var(--gap)' } as CSSProperties}
        >
            {/* 2. THẺ NỘI DUNG: Đây mới là nơi nhận Ref và xử lý kéo/cuộn */}
            <div
                {...props}
                ref={ref} // Gắn ref vào đây để kéo nội dung bên trong
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                className={`flex h-full w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${vertical ? "flex-col" : "flex-row"}`}
            >
                <div
                    className={`flex shrink-0 gap-[var(--gap)] py-2 md:py-4
                    ${vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee-horizontal'}
                    ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}
                    ${reverse ? '[animation-direction:reverse]' : ''}`}
                    style={{ gap: 'var(--gap)' }}
                >
                    {Array.from({ length: repeat * 2 }).map((_, index) => (
                        <div key={`item-${index}`} className={"flex shrink-0 gap-[var(--gap)]"}>
                            {children}
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. THẺ MASK: Bây giờ nó sẽ đứng im tuyệt đối vì nó là con của thẻ ngoài (không cuộn) */}
            {applyMask && (
                <div
                    className={`pointer-events-none absolute inset-0 z-10 h-full w-full 
                    from-[#FDF8EE] from-5% via-transparent via-20% to-[#FDF8EE] to-95%
                    ${vertical ? "bg-gradient-to-b" : "bg-gradient-to-r"}`}
                ></div>
            )}
        </div>
    )
}

export default Marquee;