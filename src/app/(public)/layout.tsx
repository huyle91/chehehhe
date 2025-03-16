import Footer from "@/components/footer";
import { Header } from "@/components/header";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <Header />
      <div className="flex flex-1 flex-col gap-4 md:gap-8">{children}</div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
