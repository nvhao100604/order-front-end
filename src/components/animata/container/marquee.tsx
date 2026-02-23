import { CSSProperties, MouseEvent, RefObject } from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Should the marquee scroll horizontally or vertically.
     * If set to `true`, the marquee will scroll vertically.
     *
     * @default false
     */
    vertical?: boolean;

    /**
     * The number of times to repeat the children. Set this value so that the repeated children overflow the container.
     * @default 5
     */
    repeat?: number;

    /**
     * Reverse the marquee direction.
     */
    reverse?: boolean;

    /**
     * Pause the marquee animation on hover.
     */
    pauseOnHover?: boolean;

    /**
     * Apply a gradient mask to the marquee.
     * @default true
     */
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
    ref,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={`
            group relative flex h-full w-full ${vertical ? "flex-col" : "flex-row"} ${className ? className : ""}`}
            style={{ '--duration': '0s', '--gap': '0.75rem', gap: 'var(--gap)' } as CSSProperties}
        >
            <div
                className={`flex shrink-0 gap-[var(--gap)] py-2 md:py-4
                ${vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee-horizontal'}
                ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}
                ${reverse ? '[animation-direction:reverse]' : ''}`}
                style={{ gap: 'var(--gap)' }}
            >
                {
                    Array.from({ length: repeat }).map((_, index) => (
                        <div
                            key={`item-${index}`}
                            className={"flex shrink-0 gap-[var(--gap)]"}
                        >
                            {children}
                        </div>
                    ))
                }
                {
                    Array.from({ length: repeat }).map((_, index) => (
                        <div
                            key={`item-${index}`}
                            className={"flex shrink-0 "}
                        >
                            {children}
                        </div>
                    ))
                }
            </div>
            {
                applyMask && (
                    <div
                        className={
                            `pointer-events-none absolute inset-0 z-10 h-full w-full from-white/50 from-5% via-transparent via-50% to-white/50 to-95% dark:from-gray-800/50 dark:via-transparent dark:to-gray-800/50
                        ${vertical ? "bg-gradient-to-b" : "bg-gradient-to-r"}`}></div>
                )}
        </div >
    )
}

export default Marquee