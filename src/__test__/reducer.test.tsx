import {
  selectItem,
  unselectItem,
  unselectAll,
  selectedItemsReducer,
} from '../store';

describe('selectedItemsSlice reducer', () => {
  it('should add an item when selectItem is dispatched', () => {
    const initialState = { items: {} };
    const newItem = { id: '123', title: 'Test', description: 'Desc' };

    const nextState = selectedItemsReducer(initialState, selectItem(newItem));

    expect(nextState.items['123']).toEqual(newItem);
  });

  it('should remove an item when unselectItem is dispatched', () => {
    const initialState = {
      items: {
        '123': { id: '123', title: 'Test', description: 'Desc' },
      },
    };

    const nextState = selectedItemsReducer(initialState, unselectItem('123'));

    expect(nextState.items).toEqual({});
  });

  it('should clear all items when unselectAll is dispatched', () => {
    const initialState = {
      items: {
        '123': { id: '123', title: 'Test', description: 'Desc' },
        '456': { id: '456', title: 'Test 2', description: 'Desc 2' },
      },
    };

    const nextState = selectedItemsReducer(initialState, unselectAll());

    expect(nextState.items).toEqual({});
  });
});
