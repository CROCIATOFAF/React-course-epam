import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Flyout from '../components/FLyout/Flyout';
import { selectedItemsReducer, unselectAll } from '../store';
import type { RootState } from '../store';

if (!URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:url';
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {};
}

const renderWithStore = (preloadedState: Partial<RootState>) => {
  const store = configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    ),
  };
};

describe('Flyout Component', () => {
  afterEach(() => {
    document.body.querySelectorAll('a').forEach((node) => node.remove());
  });

  it('renders nothing when no items are selected', () => {
    renderWithStore({ selectedItems: { items: {} } });
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it('renders correct text and buttons when items are selected', () => {
    const preloadedState = {
      selectedItems: {
        items: {
          '1': {
            id: '1',
            title: 'Test Card',
            description: 'Test description',
            image: 'http://example.com/test.jpg',
          },
        },
      },
    };
    renderWithStore(preloadedState);
    expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download/i })
    ).toBeInTheDocument();
  });

  it('dispatches unselectAll when "Unselect all" button is clicked', async () => {
    const preloadedState = {
      selectedItems: {
        items: {
          '1': {
            id: '1',
            title: 'Test Card',
            description: 'Test description',
            image: 'http://example.com/test.jpg',
          },
        },
      },
    };
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState,
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );
    const unselectButton = screen.getByRole('button', {
      name: /Unselect all/i,
    });
    fireEvent.click(unselectButton);
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(unselectAll());
    });
  });

  it('triggers download when "Download" button is clicked', async () => {
    const preloadedState = {
      selectedItems: {
        items: {
          '1': {
            id: '1',
            title: 'Test Card',
            description: 'Test description',
            image: 'http://example.com/test.jpg',
          },
        },
      },
    };

    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');

    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    renderWithStore(preloadedState);
    const downloadButton = screen.getByRole('button', { name: /Download/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
