## Performance Profiling

### Baseline (Without Memoization)

In the unoptimized version (no useMemo, useCallback, or React.memo), the profiler recorded:

- **Commit Duration:**
  - Ranged from ~1.1 ms up to 29.2 ms (with many commits around 17–18 ms).
  - This indicates that the full component tree re-renders on every update.
- **Render Duration:**
  - Individual component render times were low (about 0.1–0.4 ms), but overall cost is high because every state change recalculates everything.
- **Interactions:**
  - Filtering, searching, and sorting triggered many re-renders.

**Screenshots (Baseline):**

_Flame Graphs:_
![Initial Flame Graph 1](./src/assets/screenshots/flame%20graph/flame%201.png)  
![Initial Flame Graph 2](./src/assets/screenshots/flame%20graph/flame%202.png)  
![Initial Flame Graph 3](./src/assets/screenshots/flame%20graph/flame%203.png)  
![Initial Flame Graph 4](./src/assets/screenshots/flame%20graph/flame%204.png)  
![Initial Flame Graph 5](./src/assets/screenshots/flame%20graph/flame%205.png)  
![Initial Flame Graph 6](./src/assets/screenshots/flame%20graph/flame%206.png)  
![Initial Flame Graph 7](./src/assets/screenshots/flame%20graph/flame%207.png)

_Ranked Charts:_

- **Initial Load:**  
  ![Initial Ranked Chart – Load](./src/assets/screenshots/flame%20graph/initial%20load.png)
- **Small List:**  
  ![Small List 1](./src/assets/screenshots/flame%20graph/small%20list%201.png)  
  ![Small List 2](./src/assets/screenshots/flame%20graph/small%20list%202.png)  
  ![Small List 3](./src/assets/screenshots/flame%20graph/small%20list%203.png)  
  ![Small List 4](./src/assets/screenshots/flame%20graph/small%20list%204.png)  
  ![Small List 5](./src/assets/screenshots/flame%20graph/small%20list%205.png)  
  ![Small List 6](./src/assets/screenshots/flame%20graph/small%20list%206.png)  
  ![Small List 7](./src/assets/screenshots/flame%20graph/small%20list%207.png)  
  ![Small List 8](./src/assets/screenshots/flame%20graph/small%20list%208.png)
- **Big List:**  
  ![Big List 1](./src/assets/screenshots/flame%20graph/big%20list%201.png)  
  ![Big List 2](./src/assets/screenshots/flame%20graph/big%20list%202.png)  
  ![Big List 3](./src/assets/screenshots/flame%20graph/big%20list%203.png)  
  ![Big List 4](./src/assets/screenshots/flame%20graph/big%20list%204.png)  
  ![Big List 5](./src/assets/screenshots/flame%20graph/big%20list%205.png)

## Every update caused a full re-computation and re-render, leading to higher commit times and many interactions.

### Optimized (With Memoization)

After adding useMemo, useCallback, and React.memo:

- **Commit Duration:**
  - Most commits now occur in under 10 ms.
- **Render Duration:**
  - Component render times are even lower.
- **Interactions:**
  - Fewer re-renders occur during filtering, searching, and sorting.
- **Flame Graph & Ranked Chart:**
  - The optimized flame graphs show fewer spikes.
  - Ranked charts confirm that key components render much faster.

**Screenshots (Optimized Version):**

_Optimized Flame Graphs:_
![Optimized Flame Graph 1](./src/assets/screenshots/optimized/flame%20graph/optimized%20flame%201.png)  
![Optimized Flame Graph 2](./src/assets/screenshots/optimized/flame%20graph/optimized%20flame%202.png)  
![Optimized Flame Graph 3](./src/assets/screenshots/optimized/flame%20graph/optimized%20flame%203.png)
_Optimized Ranked Charts:_
![Optimized Ranked Chart 1](./src/assets/screenshots/optimized/ranked%20chart/opotimized%20ranked%201.png)  
![Optimized Ranked Chart 2](./src/assets/screenshots/optimized/ranked%20chart/opotimized%20ranked%202.png)  
![Optimized Ranked Chart 3](./src/assets/screenshots/optimized/ranked%20chart/opotimized%20ranked%203.png)

### In Conclusion

- **Baseline:** Commit times up to 29.2 ms, frequent re-renders.
- **Optimized:** Most commits under 10 ms, smoother interactions with fewer re-renders.
