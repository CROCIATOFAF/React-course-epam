import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, cleanup } from '@testing-library/react';

describe('Index Entry Point', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('id', 'root');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    cleanup();
  });

  it('renders the App without crashing', async () => {
    await act(async () => {
      await import('../main');
    });
    expect(container.innerHTML).not.toBe('');
  });
});
