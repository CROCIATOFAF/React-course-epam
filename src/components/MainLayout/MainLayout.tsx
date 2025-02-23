import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Home from '../../pages/Home';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const detailsOpen = location.pathname.startsWith('/details');

  const handleLeftSectionClick = () => {
    if (detailsOpen) {
      const params = new URLSearchParams(location.search);
      const frontpage = params.get('frontpage');
      navigate(frontpage ? `/?frontpage=${frontpage}` : '/');
    }
  };

  return (
    <div className={styles.mainLayout}>
      <div className={styles.leftSection} onClick={handleLeftSectionClick}>
        <Home onSearchSubmit={() => {}} />
      </div>
      {detailsOpen && (
        <div data-testid="outlet" className={styles.rightSection}>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
