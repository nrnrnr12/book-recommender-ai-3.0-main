import MarketNavbar from '@/components/MarketNavbar';

export default function MarketLayout({ children }) {
  return (
    <section style={{ position: 'relative' }}> {/* ไม่ควรมี backgroundColor: 'black' ตรงนี้ */}
      <MarketNavbar />
      {children}
    </section>
  );
}