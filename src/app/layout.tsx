'use client';

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ThemeSwitcher from '../components/ThemeSwitcher/ThemeSwitcher';
import Flyout from '../components/FLyout/Flyout';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundary>
              <ThemeSwitcher />
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <Flyout />
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
