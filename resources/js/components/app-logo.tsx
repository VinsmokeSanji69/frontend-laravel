import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm ">
                <div className="flex flex-col leading-none gap-1 overflow-ellipsis">
                    <p className="text-foreground font-medium text-xl">ExamBits</p>
                </div>
            </div>
        </>
    );
}
