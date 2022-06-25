import { useState } from 'react'

interface ISorts {
  companyName?: boolean;
}

/* This hook has two parts: a state to store the current sort and a function that
 * applies this sort to some arbitrary list of items.
 */
function useSort() {
  const [sorts, setSorts] = useState<ISorts>({});

  // Flips the bool in sorts[sortType].
  function toggleSort(sortType: string) {
    setSorts(prev => ({
      ...prev,
      [sortType]: !(prev as any)[sortType],
    }));
  }

  /* For simplicity, this only sorts by companyName, and in one direction. Other sorts could
   * easily be appended to the condition chain, and a parameter for direction could be used
   * to reverse the order.
   */
  function applySorts(list: any[]) {
    return list.sort((a, b) => {

      if (sorts.companyName) {
        return ('' + a.companyName).localeCompare(b.companyName);
      }

      // else if (sorts.someOtherSort), else if (...) ...

      return 0;
    });
  }
 
  return {
    sorts,
    toggleSort,
    applySorts,
  };
}

export default useSort;