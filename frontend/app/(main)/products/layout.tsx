import Navbar from "@/components/Navbar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="products-container">
      <Navbar></Navbar>
      {children}
    </section>
  );
}
