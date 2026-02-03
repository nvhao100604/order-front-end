'use client'
import { BACKGROUND_URL, RESTAURANT_1, RESTAURANT_2, RESTAURANT_3, RESTAURANT_4 } from "@/config"
import Link from "next/link"
import Marquee from "../animata/container/marquee"
import { defaultQuery, IDish, Query } from "@/interfaces"
import { formatter } from "@/utils"
import { FaCartPlus, FaConciergeBell, FaCrown, FaHeart, FaUtensils } from "react-icons/fa"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { getDishesSWR } from "@/services"
import { useCounter, useIntersectionObserver } from "@/hooks"
import { IconType } from "react-icons/lib"
import { Skeleton } from "../ui/skeleton"

const Title = ({ title }: { title: string }) => {
    return (
        <h1 className="section-title relative from-yellow-600 via-yellow-400 to-yellow-600 from-0% via-50% to-90% 
          bg-clip-text text-4xl font-extrabold font-pacifico py-6 w-fit text-transparent text-shadow-2xs bg-gradient-to-r">
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
        <div className="relative h-screen w-full bg-gray-800">
            <img
                className="object-cover w-full h-full"
                src={BACKGROUND_URL} alt="foodie-background" />
            <div className="absolute top-[calc(10vh_+_10rem)] left-[calc(10vh_+_5rem)] p-3 w-2/5">
                <h1
                    ref={el => { h1Ref.current = el }}
                    className={`text-6xl text-white font-nunito font-bold transition-all duration-800 -translate-x-full
                    ${h1_visible && "translate-x-0"}`}
                >
                    Taste and heart come together
                </h1>
                <p
                    ref={el => { pRef.current = el }}
                    className={`text-xl text-white mt-12 mb-20 mr-20 text-justify transition-all -translate-x-full duration-900 delay-100
                    ${p_visible && "translate-x-0"}`}
                >
                    A favorite among locals and visitors alike. Our cozy atmosphere and heartfelt dishes are perfect for sharing special moments with family and friends
                </p>
                <button
                    ref={el => { btnRef.current = el }}
                    className={`py-2 px-3 text-white font-medium text-2xl bg-orange-600 rounded-sm
              shadow-neutral-800 shadow-lg transition-colors duration-500 -translate-x-full
              hover:bg-orange-700 ${btn_visible && "transition-transform duration-1000 delay-100 translate-x-0"}`}
                    style={{ animationDuration: '1s', animationDelay: '0.1s' }}
                >
                    <Link
                        href={"/menu"}>View Our Menu
                    </Link>
                </button>
            </div>
        </div >
    )
}

const MarqueeCard = ({ dish }: { dish: IDish }) => {
    return (
        <>
            {dish &&
                <div className="max-w-sm w-72 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-3xl transition-all duration-400 hover:scale-110">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            className="h-full w-full object-cover overflow-hidden animate-fadeIn"
                            src={dish.imgUrl ?? BACKGROUND_URL} alt="quality-dishes" />

                        <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <span className="text-lg font-bold text-orange-600">{formatter.format(dish.price)}</span>
                        </div>

                        <button
                            className="absolute top-4 right-4 bg-white text-gray-600 rounded-full p-2 text-xl hover:text-pink-500">
                            <FaHeart /></button>
                    </div>

                    <div className="p-6 relative">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{dish.name}</h3>
                        <div className="h-6 mb-6 bg-gray-50 rounded-lg py-1">
                            <div className="marquee text-sm text-gray-600 font-medium">
                                {dish.describe}
                            </div>
                        </div>

                        <div className="w-full justify-center place-items-center flex">
                            <button className="w-4/5 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold py-2 px-5 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const MarqueeBox = ({ dishes }: { dishes: IDish[] }) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [isDown, setIsDown] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return
        setIsDown(true)
        setStartX(e.pageX - sliderRef.current.offsetLeft)
        setScrollLeft(sliderRef.current.scrollLeft)
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault()
        const x = e.pageX - sliderRef.current.offsetLeft
        const walk = (x - startX) * 1.5
        sliderRef.current.scrollLeft = scrollLeft - walk
    }

    return (
        <Marquee
            onMouseDown={(e: MouseEvent<HTMLDivElement>) => handleMouseDown(e)}
            onMouseUp={() => setIsDown(false)}
            onMouseLeave={() => setIsDown(false)}
            onMouseMove={(e: MouseEvent<HTMLDivElement>) => handleMouseMove(e)}
            ref={sliderRef}
            pauseOnHover
            className="bg-transparent px-4 py-12 flex cursor-grab overflow-x-scroll scrollbar-hide">
            {dishes && (dishes as IDish[]).map(dish => (
                <MarqueeCard key={`dish-${dish.id}`} dish={dish} />
            ))}
        </Marquee>
    )
}

const MarqueeSkeletonCard = () => {
    return (
        <div className="max-w-sm w-72 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-3xl transition-all duration-400 hover:scale-110">
            <div className="relative h-48 overflow-hidden">
                <div className="h-full w-full object-cover overflow-hidden">
                    <Skeleton className="h-full w-full" />
                </div>
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span className="h-8"><Skeleton className="h-full w-full" /></span>
                </div>
            </div>
            <div className="p-4 relative flex flex-col justify-center place-items-center">
                <div className="h-6 mb-2 w-3/5">
                    <Skeleton className="h-full w-full" />
                </div>
                <div className="h-6 mb-6 rounded-sm w-4/5">
                    <Skeleton className="h-full w-full" />
                </div>

                <div className="w-full justify-center place-items-center flex">
                    <button className="w-4/5 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold py-2 px-5 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all duration-300 transform shadow-lg hover:shadow-xl">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

const MarqueeSkeleton = () => {
    const spawn = () => {
        const list = []
        for (let i = 0; i < 8; i++) {
            list.push(
                <MarqueeSkeletonCard key={`card-${i}`} />)
        }
        return list
    }
    return (
        <Marquee pauseOnHover className="bg-transparent px-4 py-12">
            {spawn()}
        </Marquee>
    )
}

const MarqueeContainer = () => {
    const query: Query = defaultQuery
    const { data, isLoading, error } = getDishesSWR(query)
    const dishes = data?.data
    const marqueeRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: marqueeRef })
    return (
        <div className="p-2">
            <div id="best-seller" className="mt-16 mb-16"></div>
            <div className="flex flex-col text-center place-items-center justify-center">
                <div id="best-seller" className="mb-6"></div>
                <Title title="best Seller" />
                <h2 className="text-4xl font-bold font-nunito text-shadow-lg mb-16 animate-flip-vertical origin-center">
                    Most Popular Items
                </h2>
                <div
                    ref={ref => { (marqueeRef.current = ref) }}
                    className="storybook-fix relative flex h-full max-h-110 min-h-72 w-full min-w-72 items-center justify-center overflow-hidden rounded bg-transparent animate-fadeIn">
                    {(isVisible && isLoading) && <MarqueeSkeleton />}
                    {isVisible && dishes && <MarqueeBox dishes={dishes as IDish[]} />}
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
            className={`group w-full h-full hover:bg-orange-400 bg-white scale-y-0
                            transition-all duration-400 shadow-xl rounded-b-sm flex-col px-6 py-12 origin-bottom
            ${isVisible ? `scale-y-100 transition-transform ${duration}` : ""}`}
        >
            <Icon className="text-5xl text-orange-400 group-hover:text-white transition-colors duration-400" />
            <h1 className="mt-6 text-xl font-bold font-nunito py-2 text-black group-hover:text-white transition-colors duration-400">
                {title}
            </h1>
            <p className="text-md pr-8 break-words text-gray-500 font-varela-round text-justify group-hover:text-white transition-colors duration-400">
                {subTitle}
            </p>
        </div>
    )
}

const IntroContainer = () => {
    return (
        <div className="grid grid-cols-4 gap-6 mt-10">
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
                subTitle="Seamless and convenient online ordering, bringing your favorite dishes to you with ease"
                icon={FaCartPlus}
                duration="duration-1500"
            />
            <IntroCard
                title="Fully Serviced"
                subTitle="Attentive service to give you a complete and enjoyable dining experience"
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
    duration?: number
}
const DataSpan = ({
    number,
    span1,
    span2,
    duration = 1500
}: DataSpanProps) => {
    const spanRef = useRef<HTMLElement | null>(null)
    const { isVisible } = useIntersectionObserver({ ref: spanRef })
    const counter = useCounter(number, duration, isVisible)

    return (
        <div
            ref={ref => { (spanRef.current = ref) }}
            className={`w-full flex border-l-6 border-yellow-500 py-2 px-4 scale-y-0 origin-bottom transition-all duration-800 
                        ${isVisible && "scale-y-100"}`}>
            <span className="text-5xl font-bold h-full font-nunito text-yellow-500">
                {counter}
            </span>
            <div className="flex flex-col ml-4">
                <span className={`text-gray-500 font-bold transition-all duration-400 delay-800 -translate-x-full
                                ${isVisible && "translate-x-0"}`}>
                    {span1}
                </span>
                <span className={`uppercase font-bold transition-all duration-400 delay-900 -translate-x-full
                                ${isVisible && "translate-x-0"}`}
                >{span2}
                </span>
            </div>
        </div>
    )
}

const AboutContainer = () => {
    return (
        <div className="flex flex-col justify-center place-items-center">
            <div id="about-us" className="mb-16"></div>
            <Title title="About Us" />
            <div className="flex w-full">
                <div className="flex flex-wrap relative w-1/2 aspect-square gap-4 p-4">
                    <AboutImage className="flex place-items-end" width="w-full" image={RESTAURANT_1} />
                    <AboutImage className="flex flex-wrap justify-start items-end" width="w-3/4" image={RESTAURANT_2} />
                    <AboutImage className="flex flex-wrap justify-end items-start" width="w-3/4" image={RESTAURANT_3} />
                    <AboutImage className="flex place-items-start" width="w-full" image={RESTAURANT_4} />
                </div>
                <div className="flex place-items-center m-auto p-6 w-1/2 aspect-square">
                    <div className="w-full flex flex-col gap-8">
                        <h1 className="font-extrabold font-nunito text-4xl">
                            Welcome to Foodie Restaurant
                        </h1>
                        <p className="text-md break-words font-varela-round text-gray-500 pr-20 text-justify">
                            We offers a unique culinary journey where traditional flavors blend seamlessly with modern creativity. A cozy ambiance and dedicated service ensure every meal becomes a memorable experience
                        </p>
                        <p className="text-md break-words font-varela-round text-gray-500 pr-20 text-justify">
                            We use only the freshest ingredients, carefully sourced from trusted suppliers. Under the mastery of our chefs, every dish is transformed into a flavorful and inspiring creation
                        </p>
                        <div className="flex place-items-stretch justify-stretch font-varela-round">
                            <DataSpan number={15} span1="Years of" span2="experience" />
                            <DataSpan number={50} span1="Popular" span2="Master Chefs" />
                        </div>

                        <button
                            className="py-4 px-3 bg-yellow-500 hover:bg-yellow-300 transition-all duration-400 w-2/7 text-2xl font-nunito font-bold text-white"
                        >Read More</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { BackgroundContainer, MarqueeContainer, IntroContainer, AboutContainer, Title }