import { IntroContainer, BackgroundContainer, MarqueeContainer, AboutContainer } from "@/components";

export default function Home() {
    return (
        <>
            <div className="-mt-18 min-h-[calc(100vh_-_0rem)] px-0 md:px-6 lg:px-12 overflow-hidden">
                <div className="h-[50vh] md:h-screen">
                    <BackgroundContainer />
                </div>
                <div className="mt-[10dvh]">
                    <IntroContainer />
                </div>
                <div className="mt-[10dvh]">
                    <AboutContainer />
                </div>
                <div>
                    <MarqueeContainer />
                </div>
                <div className="w-full h-full mt-[10dvh]">
                    <div className="">Chefs Container</div>
                </div>
            </div>
        </>
    );
}
