import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">
          <Link href="/">SMB Suvanna Dipa</Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Beranda
          </Link>
          <Link href="/tentang-kami" className="text-gray-600 hover:text-blue-600">
            Tentang Kami
          </Link>
          <Link href="/aktivitas-kami" className="text-gray-600 hover:text-blue-600">
            Aktivitas Kami
          </Link>
        </div>
        <div>
          <Link href="/login">
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Masuk
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
