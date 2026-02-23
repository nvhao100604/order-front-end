import "../globals.css";
import { Footer, Header } from "@/components/app";

function GuestLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <div className="flex flex-col min-h-screen z-0 bg-amber-50">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </div>
        </>

    );
}

export default GuestLayout;