'use client'
import { BACKGROUND_URL, RESTAURANT_1, RESTAURANT_2, RESTAURANT_3, RESTAURANT_4 } from "@/config"
import Link from "next/link"
import Marquee from "../animata/container/marquee"
import { defaultQuery, ICartItem, IDish, Query } from "@/interfaces"
import { formatter, onMouseDownHandler, onMouseLeaveHandler, onMouseMoveHandler, onMouseUpHandler } from "@/utils"
import { FaCartPlus, FaConciergeBell, FaCrown, FaHeart, FaShoppingCart, FaStar, FaUtensils } from "react-icons/fa"
import { MouseEvent, useRef, useState } from "react"
import { useAddToCart, useCounter, useIntersectionObserver } from "@/hooks"
import { IconType } from "react-icons/lib"
import { Skeleton } from "../ui/skeleton"
import { dishes_services } from './../../services/dish/dish.services';
import { useRouter } from "next/navigation"
import DishModal from "../menu/menu.dish_modal"
import { Modal } from "../app"

const Title = ({ title }: { title: string }) => {
    return (
        <h1 className="section-title relative from-yellow-600 via-yellow-400 to-yellow-600 from-0% via-50% to-90% 
          bg-clip-text text-3xl md:text-4xl font-extrabold font-pacifico py-4 md:py-6 w-fit text-transparent text-shadow-2xs bg-gradient-to-r text-center">
            {title}
        </h1>
    )
}
const BackgroundContainer = () => {
    const h1Ref = useRef<HTMLElement | null>(null)
    const pRef = useRef<HTMLElement | null>(null)
    const btnRef = useRef<HTMLElement | null>(null)
    const { isVisible: h1_visible } = useIntersectionObserver({ ref: h1Ref })
    const { isVisible: p_visible } = useIntersectionObserver({ ref: pRef })
    const { isVisible: btn_visible } = useIntersectionObserver({ ref: btnRef })
    return (
        <div className="relative h-full w-full bg-gray-800">
            <img
                className="object-cover w-full h-full hidden md:block animate-fadeIn"
                src={BACKGROUND_URL} alt="foodie-desktop"
            />
            <img
                className="object-cover object-[75%_center] w-full h-full block md:hidden animate-fadeIn"
                src={BACKGROUND_URL} alt="foodie-mobile"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 md:bg-black/20 pointer-events-none"></div>
            <div className="absolute top-[20%] md:top-[calc(10vh_+_10rem)] left-4 md:left-[calc(10vh_+_5rem)] p-2 md:p-3 w-[90%] sm:w-4/5 md:w-2/3 lg:w-2/5">
                <h1
                    ref={el => { h1Ref.current = el }}
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-nunito font-bold transition-all duration-800 -translate-x-full
                    ${h1_visible && "translate-x-0"}`}
                >
                    Taste and heart come together
                </h1>

                <p
                    ref={el => { pRef.current = el }}
                    className={`text-sm sm:text-base md:text-lg lg:text-xl text-white mt-4 md:mt-8 mb-6 md:mb-12 pr-2 md:pr-20 text-left md:text-justify transition-all -translate-x-full duration-900 delay-100
            ${p_visible && "translate-x-0"}`}
                >
                    A favorite among locals and visitors alike. Our cozy atmosphere and heartfelt dishes are perfect for sharing special moments with family and friends.
                </p>

                <button
                    ref={el => { btnRef.current = el }}
                    className={`py-3 px-6 text-white font-medium text-lg md:text-xl bg-orange-600 rounded-lg
                    shadow-neutral-800 shadow-lg transition-all duration-700 -translate-x-full
                    hover:bg-orange-700 hover:scale-105 ${btn_visible && "translate-x-0"}`}
                    style={{ transitionDelay: btn_visible ? '200ms' : '0ms' }}
                >
                    <Link href={"/menu"} className="block w-full h-full">
                        View Our Menu
                    </Link>
                </button>

            </div>
        </div>
    )
}

const MarqueeCard = ({ dish }: { dish: ICartItem }) => {
    const [showModal, setShowModal] = useState(false)
    const addToCart = useAddToCart()
    const router = useRouter()
    const handleAddToCart = (dish: ICartItem) => {
        addToCart({
            ...dish,
            quantity: 1,
            checked: false
        })
        router.push("/guest/menu")
    }
    return (
        <>
            {dish &&
                <div
                    onClick={() => setShowModal(true)}
                    className="max-w-sm w-48 lg:w-72 my-4 bg-white rounded-2xl overflow-hidden 
                    shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col
                    shadow-orange-900/5 hover:shadow-orange-900/15"
                >
                    <div className="relative h-24 lg:h-48 overflow-hidden">
                        <img className="h-full w-full object-cover overflow-hidden animate-fadeIn" src={dish.imgUrl ?? BACKGROUND_URL} alt="quality-dishes" />
                        <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <span className="text-lg font-bold text-orange-600">{formatter.format(dish.price)}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            className="absolute top-2 right-2 lg:top-4 lg:right-4 bg-white text-gray-600 rounded-full p-2 text-xl hover:text-pink-500">
                            <FaHeart />
                        </button>
                    </div>

                    <div className="p-4 lg:p-6 flex flex-col flex-1 relative">
                        <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-2">{dish.name}</h3>
                        <div className="h-6 mb-6 bg-gray-50 rounded-lg py-2 hidden md:flex">
                            <div className="marquee text-sm text-gray-600 font-medium">
                                {dish.describe}
                            </div>
                        </div>
                        <div className="flex justify-center md:justify-start items-center gap-1 text-xs text-yellow-400 mb-2">
                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                            <span className="text-gray-400 ml-1 font-medium text-[10px] md:text-xs">(4.8)</span>
                        </div>
                        <div className="w-full justify-center place-items-center flex mt-auto pt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(dish);
                                }}
                                className="flex justify-center items-center w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold py-3 px-5 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaShoppingCart className="text-base" />
                                <span className="ml-2 text-base hidden sm:block">Add to Cart</span>
                                <span className="ml-2 text-base block sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            }

            {showModal &&
                <Modal handleClick={() => setShowModal(false)}>
                    <DishModal
                        dish={dish as IDish}
                        onClose={() => setShowModal(false)}
                        addToCart={() => handleAddToCart(dish)}
                    />
                </Modal>
            }
        </>
    )
}

const MarqueeBox = ({ dishes }: { dishes: ICartItem[] }) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    const dragRefs = {
        scrollRef: sliderRef,
        isDragging,
        startX,
        scrollLeft
    }

    return (
        <div className="relative w-full overflow-hidden group">
            <Marquee
                onMouseDown={(e: any) => onMouseDownHandler(e, dragRefs)}
                onMouseUp={() => onMouseUpHandler(dragRefs)}
                onMouseLeave={() => onMouseLeaveHandler(dragRefs)}
                onMouseMove={(e: any) => onMouseMoveHandler(e, dragRefs)}
                ref={sliderRef}
                pauseOnHover
                className="bg-transparent px-0 py-2 lg:px-2 lg:py-4 flex cursor-grab select-none overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {dishes && dishes.map(dish => (
                    <MarqueeCard
                        key={`dish-${dish.id}`}
                        dish={dish}
                    />
                ))}
            </Marquee>
        </div>
    )
}

const MarqueeSkeletonCard = () => {
    return (
        <div className="max-w-sm w-48 lg:w-72 my-4 bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col shadow-orange-900/5">
            <div className="relative h-24 lg:h-48 overflow-hidden bg-gray-100">
                <Skeleton className="h-full w-full" />

                <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    <Skeleton className="h-4 w-12 lg:w-16" />
                </div>

                <div className="absolute top-2 right-2 lg:top-4 lg:right-4 p-2">
                    <Skeleton className="h-6 w-6 lg:h-8 lg:w-8 rounded-full" />
                </div>
            </div>

            <div className="p-4 lg:p-6 flex flex-col flex-1 relative">
                <div className="mb-2">
                    <Skeleton className="h-5 lg:h-7 w-3/4 rounded-md" />
                </div>

                <div className="h-6 mb-6 bg-gray-50 rounded-lg items-center px-2 hidden md:flex">
                    <Skeleton className="h-3 w-full rounded-full" />
                </div>

                <div className="flex justify-center md:justify-start items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Skeleton key={s} className="h-3 w-3 rounded-full" />
                    ))}
                    <Skeleton className="ml-2 h-3 w-8" />
                </div>

                <div className="w-full mt-auto pt-2">
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )
}

const MarqueeSkeleton = () => {
    return (
        <Marquee pauseOnHover className="bg-transparent px-0 py-2 lg:px-2 lg:py-4">
            {[...Array(8)].map((_, i) => (
                <div key={`skeleton-${i}`} className="mx-2 lg:mx-4">
                    <MarqueeSkeletonCard />
                </div>
            ))}
        </Marquee>
    )
}

const MarqueeContainer = () => {
    const query: Query = defaultQuery
    const { data, isLoading, error } = dishes_services.getDishesSWR(query)
    const dishes = data?.data
    const marqueeRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: marqueeRef })

    return (
        <div className="p-2">
            <div id="best-seller" className="lg:my-16 my-4"></div>
            <div className="flex flex-col text-center place-items-center justify-center">
                <Title title="Best Seller" />
                <h2 className="text-4xl font-bold font-nunito text-shadow-lg mb-0 lg:mb-4 animate-flip-vertical origin-center">
                    Most Popular Items
                </h2>
                <div
                    ref={ref => { (marqueeRef.current = ref) }}
                    className="relative flex w-full items-center justify-center overflow-hidden rounded bg-transparent animate-fadeIn py-0 md:py-2">
                    {(isVisible && isLoading) && <MarqueeSkeleton />}
                    {isVisible && dishes && <MarqueeBox dishes={dishes as ICartItem[]} />}
                </div>
            </div>
        </div>
    )
}

interface IntroCardProps {
    title: string,
    subTitle: string,
    icon: IconType,
    duration: string
}

const IntroCard = ({
    title = "",
    subTitle = "",
    icon: Icon,
    duration
}: IntroCardProps) => {
    const cardRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: cardRef })
    return (
        <div
            ref={ref => { (cardRef.current = ref) }}
            className={`group w-full aspect-square hover:bg-orange-400 bg-white scale-y-0
                            transition-all duration-400 shadow-xl rounded-b-sm flex-col px-4 py-4 lg:px-6 lg:py-12 origin-bottom
            ${isVisible ? `scale-y-100 transition-transform ${duration}` : ""}`}
        >
            <Icon className="text-3xl lg:text-5xl text-orange-400 group-hover:text-white transition-colors duration-400" />
            <h1 className=" lg:mt-6 text-md lg:text-xl font-bold font-nunito py-2 text-black group-hover:text-white transition-colors duration-400">
                {title}
            </h1>
            <p className="text-sm lg:text-base leading-relaxed text-gray-500 font-varela-round text-left group-hover:text-white transition-colors duration-400">
                {subTitle}
            </p>
        </div>
    )
}

const IntroContainer = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8 lg:px-0">
            <IntroCard
                title="Chef’s Special"
                subTitle="Signature dishes crafted by our experienced chefs with unique flavors"
                icon={FaConciergeBell}
                duration="duration-500"
            />
            <IntroCard
                title="Quality Food"
                subTitle="Carefully selected ingredients to ensure the best taste in every meal"
                icon={FaCrown}
                duration="duration-1000"
            />
            <IntroCard
                title="Online Order"
                subTitle="Seamless, convenient online ordering for your favorite dishes"
                icon={FaCartPlus}
                duration="duration-1500"
            />
            <IntroCard
                title="Fully Serviced"
                subTitle="Attentive service for a refined and enjoyable dining experience"
                icon={FaUtensils}
                duration="duration-2000"
            />
        </div>
    )
}

const AboutImage = ({ width, image, className }: { width: string, image: string, className?: string }) => {
    const imageRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: imageRef, threshold: 0.4 })
    return (
        <div ref={ref => { (imageRef.current = ref) }}
            className={`w-[calc(50%_-_1rem)] aspect-square ${className ?? ""}`}
        >
            <img
                className={`object-cover overflow-hidden ${width} aspect-square transition-all duration-1000 delay-200 scale-0
                origin-center ${isVisible && `scale-100`} `}
                src={image} alt="images-about-foodie" />
        </div>
    )
}
interface DataSpanProps {
    number: number,
    span1: string,
    span2: string,
    duration?: number,
    startAnimation?: boolean
}
const DataSpan = ({
    number,
    span1,
    span2,
    duration = 1500,
    startAnimation = true
}: DataSpanProps) => {
    const spanRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: spanRef })
    const canStart = isVisible && startAnimation
    const counter = useCounter(number, duration, canStart)

    return (
        <div
            ref={ref => { (spanRef.current = ref) }}
            className={`w-max flex-none flex border-l-[6px] py-2 px-4 border-yellow-500 scale-y-0 origin-bottom transition-all duration-800 
                ${canStart && "scale-y-100"}`}>
            <span className="text-5xl font-bold h-full font-nunito text-yellow-500">
                {counter}
            </span>

            <div className="flex flex-col ml-4 overflow-hidden">
                <span className={`text-gray-500 font-bold transition-all duration-500 delay-800 -translate-x-full
                        ${canStart && "translate-x-0"}`}>
                    {span1}
                </span>
                <span className={`uppercase font-bold transition-all duration-500 delay-900 -translate-x-full
                        ${canStart && "translate-x-0"}`}
                >
                    {span2}
                </span>
            </div>
        </div>
    )
}

const AboutContainer = () => {
    const [showReadMore, setShowReadMore] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)
    const toggleReadMore = () => {
        setShowReadMore(prev => !prev)
        if (!hasOpened) {
            setHasOpened(true)
        }
    }
    return (
        <div className="flex flex-col justify-center place-items-center">
            <div id="about-us" className="mb-10 md:mb-16"></div>
            <Title title="About Us" />
            <div className="flex flex-col lg:flex-row w-full px-4 md:px-8 lg:px-0 mt-8">

                <div className="flex flex-wrap relative w-full lg:w-1/2 aspect-square gap-2 md:gap-4 p-2 md:p-4">
                    <AboutImage className="flex place-items-end" width="w-full" image={RESTAURANT_1} />
                    <AboutImage className="flex flex-wrap justify-start items-end" width="w-3/4" image={RESTAURANT_2} />
                    <AboutImage className="flex flex-wrap justify-end items-start" width="w-3/4" image={RESTAURANT_3} />
                    <AboutImage className="flex place-items-start" width="w-full" image={RESTAURANT_4} />
                </div>

                <div className="flex place-items-center m-auto p-2 md:p-6 w-full lg:w-1/2 aspect-auto lg:aspect-square mt-8 lg:mt-0">
                    <div className="w-full flex flex-col gap-4 md:gap-8 text-center lg:text-left">
                        <h1 className="font-extrabold font-nunito text-3xl md:text-4xl">
                            Welcome to Foodie Restaurant
                        </h1>

                        <p className="text-sm md:text-base font-varela-round text-gray-500 pr-0 lg:pr-20 leading-relaxed">
                            We offers a unique culinary journey where traditional flavors blend seamlessly with modern creativity. A cozy ambiance and dedicated service ensure every meal becomes a memorable experience.
                        </p>

                        <p className="text-sm md:text-base font-varela-round text-gray-500 pr-0 lg:pr-20 leading-relaxed">
                            We use only the freshest ingredients, carefully sourced from trusted suppliers. Under the mastery of our chefs, every dish is transformed into a flavorful and inspiring creation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start font-varela-round mt-4 md:mt-0">
                            <DataSpan number={15} span1="Years of" span2="Trusted Service" />
                            <DataSpan number={50} span1="Dedicated" span2="Kitchen Chefs" />
                        </div>
                        <div
                            className={`flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start font-varela-round overflow-hidden transition-all duration-500 ease-in-out
                            ${showReadMore ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <DataSpan startAnimation={hasOpened} number={60} span1="Freshly" span2="Prepared Dishes" />
                            <DataSpan startAnimation={hasOpened} number={12} span1="Comfortable" span2="Private Rooms" />
                        </div>
                        <button
                            onClick={toggleReadMore}
                            className="py-3 md:py-4 px-6 bg-yellow-500 hover:bg-yellow-300 transition-all duration-400 w-full sm:w-1/2 lg:w-fit mx-auto lg:mx-0 text-xl md:text-2xl font-nunito font-bold text-white rounded-sm mt-4 shadow-lg hover:shadow-xl"
                        >
                            {showReadMore ? "Show less" : "Read More"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { BackgroundContainer, MarqueeContainer, IntroContainer, AboutContainer, Title }