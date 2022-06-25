import { useState } from 'react';

interface IFilters {
  period?: ''|'7d';
}

/* This hook has two parts: a state to store currently active filters and a function that
 * applies these filters to some arbitrary list of items.
 */
function useFilter() {
  const [filters, setFilters] = useState<IFilters>({});
  
  // Alternates the string in filters[filterType] between '' and value.
  function toggleFilter(f: { [filterType: string]: string }) {
    const [[filterType, value]] = Object.entries(f);

    setFilters(prev => ({
      ...prev,
      [filterType]: !!(prev as any)[filterType] ? '' : value,
    }));
  }
  
  /* To keep things simple, this filter only checks if the postingDate happened more
   * than 7 days ago.
   *
   * A more scalable aproach could receive multiple filter functions that would be
   * applied conditionaly to the list[] in a single pass.
   */
  function applyFilters(list: any[]) {
    return list.filter(item => {

      if (filters.period === '7d') {
        const postingDate = +(new Date(item.postingDate));
        const lastWeek = +(new Date()).setDate((new Date()).getDate() - 7);
        
        return postingDate >= lastWeek;
      }

      // if (condition B), if (condition C), ...

      return true;
    });
  }

  return {
    filters,
    toggleFilter,
    applyFilters,
  };
}

export default useFilter;