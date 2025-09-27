import "../globals.css";
import { Footer, Header } from "@/components/app";

function GuestLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Header />
            <div className="min-h-[calc(150vh_-_50rem)] z-0 bg-amber-50">
                {children}
            </div>
            <Footer />
        </>

    );
}

export default GuestLayout;