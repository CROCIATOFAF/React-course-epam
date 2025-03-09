import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Flyout from '../components/FLyout/Flyout';
import { selectedItemsReducer, unselectAll } from '../store';
import type { RootState } from '../store';
import '@testing-library/jest-dom';

global.URL.createObjectURL = jest.fn(() => 'blob:url');
global.URL.revokeObjectURL = jest.fn();

const rootReducer = combineReducers({
  selectedItems: selectedItemsReducer,
});

const renderWithStore = (preloadedState: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
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
    jest.clearAllMocks();
  });

  it('renders nothing when no items are selected', () => {
    renderWithStore({ selectedItems: { items: {} } });
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
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

  it("dispatches unselectAll when 'Unselect all' button is clicked", async () => {
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

    const store = configureStore({ reducer: rootReducer, preloadedState });
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(unselectAll());
    });
  });

  it("triggers download when 'Download' button is clicked", async () => {
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

    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    renderWithStore(preloadedState);
    fireEvent.click(screen.getByRole('button', { name: /Download/i }));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
