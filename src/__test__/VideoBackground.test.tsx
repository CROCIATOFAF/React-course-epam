import { render, screen } from '@testing-library/react';
import VideoBackground from '../components/VideoBackground/VideoBackground';
import { ThemeContext, Theme } from '../context/ThemeContext';
import '@testing-library/jest-dom';

const renderWithTheme = (theme: Theme) => {
  return render(
    <ThemeContext.Provider value={{ theme, setTheme: jest.fn() }}>
      <VideoBackground />
    </ThemeContext.Provider>
  );
};

describe('VideoBackground Component', () => {
  it('renders the dark video when theme is dark', () => {
    renderWithTheme('dark');

    const videoElement = screen.getByRole('video');
    expect(videoElement).toBeInTheDocument();

    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', '/earth.mp4');
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });

  it('renders the light video when theme is light', () => {
    renderWithTheme('light');

    const videoElement = screen.getByRole('video');
    expect(videoElement).toBeInTheDocument();

    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', '/morning.mp4');
  });

  it('video element has autoplay, muted, and loop properties set to true', () => {
    renderWithTheme('dark');

    const videoElement = screen.getByRole('video') as HTMLVideoElement;
    expect(videoElement).toBeInTheDocument();

    expect(videoElement).toHaveAttribute('autoplay');
    expect(videoElement).toHaveAttribute('muted');
    expect(videoElement).toHaveAttribute('loop');
  });
});
