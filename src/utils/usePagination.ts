import { useState } from 'react';

const FIRST_PAGE = 1;

interface IPage {
  number: number;     // Page number. Makes sense if used as `page.number`.
  totalPages: number; // Max pages, given the limit and size of the list.
  items: any[];       // Items in the current page.
}

/* Like useSort and useFilter, this hook has both a state (and methods to manipulate it),
 * and a function that transforms some arbitrary list of items.
 */
function usePagination() {
  const [pageNumber, setPageNumber] = useState(FIRST_PAGE);

  function changePage(p: number) {
    setPageNumber(p);
  }

  function applyPagination(list: any[], limit: number): IPage {
    const totalPages = Math.ceil(Math.max(list.length, 1) / limit);

    const start = (pageNumber - 1) * limit; // pageNumber starts at 1.
    const end = pageNumber * limit;

    return {
      items: list.slice(start, end),
      totalPages,
      number: pageNumber,
    }
  }

  return {
    pageNumber,
    changePage,
    applyPagination,
  };
}

export default usePagination;