import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './VideoBackground.module.css';

const VideoBackground: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const videoSource = theme === 'dark' ? '/earth.mp4' : '/morning.mp4';

  return (
    <video
      key={theme}
      className={styles.videoBackground}
      autoPlay
      muted
      loop
      data-testid="video-background"
    >
      <source src={videoSource} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground;
