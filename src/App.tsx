import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import Spinner from './components/Spinner/Spinner';
import './App.css';

const DetailCard = lazy(() => import('./components/DetailCard/DetailCard'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <video className="video-background" autoPlay muted loop>
                <source src="earth.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="app__text-container">
                <h1>Discover</h1>
                <span>our intergalactic multimedia collections</span>
                <p className="app__text-container-important">
                  Enter: &apos;simulate404&apos; or &apos;simulate500&apos; to
                  see error messages, as NASA API will send back 200 regardless
                </p>
              </div>

              <MainLayout />
            </div>
          }
        >
          <Route index element={null} />
          <Route path="details/:id" element={<DetailCard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
