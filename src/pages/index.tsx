import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import JobList from '~/components/jobList';
import css from '~/styles/Home.module.css';
import { IJob } from '~/types';

/* ------------------------------------------------------------------------------------ */

function Home(props: { apiJobs: IJob[], epoch: number }) {
  const { apiJobs, epoch } = props;

  return (
    <main className={css.container}>
      <header>
        <h1>Jobs at Zippia</h1>
        <p>A toy project for a technical interview.</p>
      </header>

      <JobList key={epoch} jobs={apiJobs} />
    </main>
  )
}

export default Home

/* ------------------------------------------------------------------------------------ */

/* The API request is made from the server side on page load, using the query params
 * to populate the "body.title" field. This query is produced by inserting the content of the
 * search input in the url using next/router.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT || 3000}/api/mock`
    : 'https://www.zippia.com/api/jobs/';

  const body = {
    "fetchJobDesc": true,
    "title": context.query.search || '',
    "dismissedListingHashes": [],
    "previousListingHashes": [],
    "numJobs": 20, // Only fetch 20 results from the API.
  };

  const resp = await axios.post(url, body);
  const { jobs } = resp.data;

  // "epoch" is a trick to get the <JobList /> to re-render.
  return { 
    props: { apiJobs: jobs, epoch: +(new Date()) }
  }
}