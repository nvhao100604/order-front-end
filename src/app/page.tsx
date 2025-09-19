import { IntroContainer, BackgroundContainer, MarqueeContainer, AboutContainer } from "@/components";

export default function Home() {
  return (
    <>
      <div className="-mt-18 min-h-[calc(100vh_-_0rem)] px-24">
        <BackgroundContainer />
        <div className="mt-10">
          <IntroContainer />
        </div>
        <AboutContainer />
        <MarqueeContainer />
        <div className="w-100 h-100">
          <div className="">Chefs Container</div>
        </div>
      </div>
    </>
  );
}
