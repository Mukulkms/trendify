import { Link } from "react-router-dom";

export default function SuperAdminHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide text-black">
        <Link to="/">
          Trendify<sup>®</sup>
        </Link>
      </div>
    </header>
  );
}
