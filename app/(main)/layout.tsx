import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Layout for the public site — includes the navbar and footer chrome. */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
