import FilterIcon from '@mui/icons-material/FilterAltRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import SortIcon from '@mui/icons-material/SortRounded';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import JobCard from '~/components/jobCard';
import { IJob } from '~/types';
import useFilter from '~/utils/useFilter';
import usePagination from '~/utils/usePagination';
import useSort from '~/utils/useSort';
import css from './jobList.module.css';

const MAX_RESULTS = 10; // Page limit.

/* Controller component, responsible for paginating, sorting and filtering
 * a list of jobs.
 */
function JobList({ jobs }: { jobs: IJob[] }) {
  const { filters, toggleFilter, applyFilters } = useFilter();
  const { sorts, toggleSort, applySorts } = useSort();
  const { pageNumber, changePage, applyPagination } = usePagination();

  const router = useRouter();

  // Returns the processed list, filtered, sorted, and with page metadata.
  function processData(list: any[]) {
    const filtered = applyFilters(list);
    const sorted = applySorts(filtered);
    const paginated = applyPagination(sorted, MAX_RESULTS);
    
    return paginated;
  }

  // { items: IJob[], number: number, totalPages: number }
  const [jobsPage, setJobsPage] = useState(processData(jobs));
  const [isLoading, setIsloading] = useState(false);

  /* Causes a redirect with query params that are parsed by getServerSideProps()
   * in the page component.
   */
  function handleSearch(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      router.push(`?search=${(e.target as HTMLInputElement).value}`);
      setIsloading(true);
    }
  }

  // Re-process the data as a side-effect of changes in auxiliary hooks (page/sort/filter).
  useEffect(() => {
    const newList = processData(jobs);
    setJobsPage(newList);
  }, [pageNumber, filters, sorts]); // eslint-disable-line

  /* When filters change the page must be reset to prevent pages that are "out of bounds".
   * When sorts change, it is usualy good UX to bring the user back to the first page,
   * since all the items will now be in a completely diffent order.
   */
  useEffect(() => {
    changePage(1);
  }, [filters, sorts]); // eslint-disable-line

  return (
    <div className={css.container}>
      {/* List controls. */}
      <menu className={css.listControls}>
        {/* Seach field. */}
        <TextField
          label='search'
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
          }}
          onKeyUp={(e) => handleSearch(e)}
          fullWidth
        />

        <label className={css.controlLabel}>
          <ToggleButton
            value='sorts'
            selected={sorts.companyName}
            onClick={() => toggleSort('companyName')}
            color='primary'
            size='small'
            >
            <SortIcon />
            By company
          </ToggleButton>
          Sort
        </label>

        <label className={css.controlLabel}>
          <ToggleButton
            value='filters'
            selected={filters.period === '7d'}
            onClick={() => toggleFilter({ period: '7d' })}
            color='primary'
            size='small'
            >
            <FilterIcon />
            Last week
          </ToggleButton>
          Filter
        </label>
      </menu>

      {isLoading && <div className={css.loader}><CircularProgress /></div>}

      {!isLoading &&
      <>
        <Pagination
          count={jobsPage.totalPages}
          page={pageNumber}
          onChange={(_, p) => changePage(p)}
        />

        {/* The actual list of cards. */}
        <ul className={css.list}>
          {jobsPage.items.map((job: IJob, i: number) => ( 
            <li key={i}>
              <JobCard job={job} />
            </li> ))
          }
        </ul>
      </>
      }
    </div>
  );
}

export default JobList;