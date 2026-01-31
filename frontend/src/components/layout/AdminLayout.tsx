'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============================================================================
// ADMIN LAYOUT COMPONENT
// ============================================================================

export interface AdminLayoutProps {
  children: ReactNode;
  storeName?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  children?: Omit<NavItem, 'children'>[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Objednávky',
    href: '/admin/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    badge: 12,
  },
  {
    label: 'Produkty',
    href: '/admin/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Kategórie',
    href: '/admin/categories',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: 'Dodávatelia',
    href: '/admin/vendors',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: 'Feedy',
    href: '/admin/feeds',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    label: 'Používatelia',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: 'Nastavenia',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  storeName = 'ESHOPY',
  userName = 'Admin',
  userEmail = 'admin@eshopy.sk',
  userAvatar,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${active 
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 -ml-[2px] pl-[14px]' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className={active ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
        {sidebarOpen && <span>{item.label}</span>}
        {sidebarOpen && item.badge !== undefined && (
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-gray-900">{storeName}</span>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="mx-auto">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
            </Link>
          )}
          
          {/* Toggle button - desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>

          {/* Close button - mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                {userInitials}
              </div>
            )}
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Hľadať..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* View store */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Zobraziť obchod</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE HEADER COMPONENT - For admin pages
// ============================================================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-4">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.href ? (
                <Link href={item.href} className="text-gray-500 hover:text-gray-700">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
