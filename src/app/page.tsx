import { IntroContainer, BackgroundContainer, MarqueeContainer, AboutContainer, Title } from "@/components";
import { FaBookmark } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="-mt-18 min-h-[calc(100vh_-_0rem)] px-24 bg-white">
        <BackgroundContainer />
        <div className="mt-10">
          <IntroContainer />
        </div>
        <div className="flex flex-col justify-center place-items-center">
          <div id="about-us" className="mb-16"></div>
          <Title title="About Us" />
          <AboutContainer />
        </div>

        <div className="p-2">
          <div id="best-seller" className="mt-16 mb-16"></div>
          <div className="flex flex-col text-center place-items-center justify-center">
            {/* <FaBookmark className="text-4xl text-red-700" /> */}
            <div id="best-seller" className="mb-6"></div>
            <Title title="best Seller" />
            <h2 className="text-4xl font-bold font-nunito text-shadow-lg mb-16 animate-flip-vertical origin-center">
              Most Popular Items
            </h2>
            <MarqueeContainer />
          </div>
        </div>

        <div className="w-100 h-100">
          <div className="">Chefs Container</div>
        </div>
      </div>
    </>
  );
}
