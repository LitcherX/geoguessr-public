import Footer from "@/_lib/components/footer";
import LayoutMain from "@/_lib/layouts/layoutMain";
import "@lib/css/global.css";

export default function LayoutProfile({ children }) {
    return (
        <LayoutMain>
            <div className="flex justify-center w-screen">
                <div className="flex flex-col min-h-screen w-[1100px] gap-[100px]">
                    <main className="mt-[50px] h-full z-20 flex items-center justify-center">
                        {children}
                    </main>
                    <footer className="mt-auto z-10">
                        <Footer />
                    </footer>
                </div>
            </div>
        </LayoutMain>
    );
}
