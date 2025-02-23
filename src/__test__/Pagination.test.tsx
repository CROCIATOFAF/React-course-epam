import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination/Pagination';

describe('Pagination Component', () => {
  const onPageChangeMock = vi.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('renders the correct number of page buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('disables the button corresponding to the current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toBeDisabled();
  });

  it('calls onPageChange with the correct page number when a non-current button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    const button = screen.getByRole('button', { name: '4' });
    fireEvent.click(button);
    expect(onPageChangeMock).toHaveBeenCalledTimes(1);
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });
});
