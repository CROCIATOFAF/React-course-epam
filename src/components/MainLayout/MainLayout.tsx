import React from 'react';
import { useRouter } from 'next/router';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const detailsOpen = router.pathname.startsWith('/details');

  const handleLeftSectionClick = () => {
    const frontpage = router.query.frontpage;
    router.push(frontpage ? `/?frontpage=${frontpage}` : '/');
  };

  return (
    <div className={styles.mainLayout}>
      <div className={styles.leftSection} onClick={handleLeftSectionClick}>
        <h1 onClick={() => router.push('/')}>Home</h1>
      </div>
      {detailsOpen && (
        <div data-testid="outlet" className={styles.rightSection}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MainLayout;
