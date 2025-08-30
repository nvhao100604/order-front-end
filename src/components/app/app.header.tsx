import { HeaderUser, Logo, Navigation } from "./header/header.index";

const Header = () => {
    return (
        <header className="sticky top-0 z-1000 h-18 grid grid-cols-3 place-items-center bg-black/30">
            <div className="col-span-1">
                <Logo />
            </div>
            <div className="col-span-1">
                <Navigation />
            </div>
            <div className="col-span-1 w-4/5">
                <HeaderUser />
            </div>
        </header>
    );
}

export default Header