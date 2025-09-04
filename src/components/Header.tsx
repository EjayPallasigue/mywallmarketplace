'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-orange-500 font-bold text-lg">M</span>
              </div>
              <span className="text-white text-xl font-bold">
                MyWall
              </span>
              <span className="text-white/80 text-sm">Marketplace</span>
            </Link>
          </div>
          
          <nav className="flex space-x-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-white text-orange-500 shadow-md'
                  : 'text-white hover:bg-white/20 hover:text-white'
              }`}
            >
              🏠 Browse
            </Link>
            <Link
              href="/create"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/create'
                  ? 'bg-white text-orange-500 shadow-md'
                  : 'text-white hover:bg-white/20 hover:text-white'
              }`}
            >
              ➕ Sell Now
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-white font-semibold text-sm">
              🎉 Welcome to MyWall Marketplace - Buy & Sell Locally! 🎉
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
