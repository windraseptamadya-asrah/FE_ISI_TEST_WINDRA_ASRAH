import Navbar from "@/lib/components/main/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Navbar />
      <main className="p-4 min-h-screen">{children}</main>
    </>
  );
}
