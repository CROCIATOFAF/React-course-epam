import { selectSelectedItems, RootState } from '../store';

describe('selectSelectedItems selector', () => {
  it('returns an array of selected items', () => {
    const mockState: RootState = {
      selectedItems: {
        items: {
          '123': { id: '123', title: 'Test 1', description: 'Desc 1' },
          '456': { id: '456', title: 'Test 2', description: 'Desc 2' },
        },
      },
    };

    const result = selectSelectedItems(mockState);
    expect(result).toEqual([
      { id: '123', title: 'Test 1', description: 'Desc 1' },
      { id: '456', title: 'Test 2', description: 'Desc 2' },
    ]);
  });

  it('returns an empty array when no items are selected', () => {
    const mockState: RootState = { selectedItems: { items: {} } };
    const result = selectSelectedItems(mockState);
    expect(result).toEqual([]);
  });
});
