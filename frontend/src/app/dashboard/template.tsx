'use client';

import React from 'react';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-in w-full h-full flex flex-col flex-1">
      {children}
    </div>
  );
}
