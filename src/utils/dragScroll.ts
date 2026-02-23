import { MouseEvent, RefObject } from "react";

interface DragScrollRefs {
    scrollRef: RefObject<HTMLDivElement | null>;
    isDragging: RefObject<boolean>;
    startX: RefObject<number>;
    scrollLeft: RefObject<number>;
}

export const onMouseDownHandler = (
    e: MouseEvent,
    { scrollRef, isDragging, startX, scrollLeft }: DragScrollRefs
) => {
    isDragging.current = true;
    if (!scrollRef.current) return;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add('cursor-grabbing');
};

export const onMouseLeaveHandler = (
    { scrollRef, isDragging }: Pick<DragScrollRefs, 'scrollRef' | 'isDragging'>
) => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
};

export const onMouseUpHandler = (
    { scrollRef, isDragging }: Pick<DragScrollRefs, 'scrollRef' | 'isDragging'>
) => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
};

export const onMouseMoveHandler = (
    e: MouseEvent,
    { scrollRef, isDragging, startX, scrollLeft }: DragScrollRefs,
    callback?: () => void
) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    if (callback) callback();
};