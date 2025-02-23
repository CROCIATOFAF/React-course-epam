import { render } from '@testing-library/react';
import VideoBackground from '../components/VideoBackground/VideoBackground';
import { ThemeContext, Theme } from '../context/ThemeContext';

const renderWithTheme = (theme: Theme) => {
  const dummySetTheme = () => {};
  return render(
    <ThemeContext.Provider value={{ theme, setTheme: dummySetTheme }}>
      <VideoBackground />
    </ThemeContext.Provider>
  );
};

describe('VideoBackground', () => {
  it('renders the dark video when theme is dark', () => {
    const { container } = renderWithTheme('dark');

    const videoElement = container.querySelector('video');
    expect(videoElement).toBeInTheDocument();

    const sourceElement = videoElement?.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', 'earth.mp4');
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });

  it('renders the light video when theme is light', () => {
    const { container } = renderWithTheme('light');

    const videoElement = container.querySelector('video');
    expect(videoElement).toBeInTheDocument();

    const sourceElement = videoElement?.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', 'morning.mp4');
  });

  it('video element has autoplay, muted, and loop properties set to true', () => {
    const { container } = renderWithTheme('dark');
    const videoElement = container.querySelector('video') as HTMLVideoElement;
    expect(videoElement).toBeInTheDocument();

    expect(videoElement.autoplay).toBe(true);
    expect(videoElement.muted).toBe(true);
    expect(videoElement.loop).toBe(true);
  });
});
