'use client';

import Navigation from '../components/Navigation';

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation>{children}</Navigation>
    </div>
  );
}
