import ExpandIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

import { useState } from 'react';
import { IJob } from '~/types';
import css from './jobCard.module.css';

/* ------------------------------------------------------------------------------------ */
// Custom styles for MUI components.

const cardSx = {
  borderLeft: '4px solid #205fd0',
  transition: 'border ease 150ms',
}

const summarySx = {
  backgroundColor: 'rgba(0,0,0,0.1)',
};

/* ------------------------------------------------------------------------------------ */

// View component, responsible for displaying a single job.
function JobCard({ job }: { job: IJob }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card sx={isExpanded ? cardSx : {}}>
      <CardContent>
        <h3>{job.jobTitle}</h3>

        <div className={css.headerRow}>
          <p>at <span className={css.company}>{job.companyName}</span></p>
          <p>{job.estimatedSalary}</p>
          <p>{job.postedDate}</p>
        </div>
      </CardContent>

      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded(prev => !prev)}
      >
        <AccordionSummary
          expandIcon={<ExpandIcon />}
          sx={isExpanded ? summarySx : {}}
        >
          {isExpanded
            ? 'Show less'
            : `${job.snippets?.[0] ? job.snippets[0] + '...' : ''} Read more`
          }
        </AccordionSummary>

        <AccordionDetails>
          <div className={css.chipList}>
            {[...job.jobLevels, job.requiredDegree] // This a bit precarious.
              .filter(tag => !!tag)
              .map((tag, i) => <Chip label={tag} key={i} size='small' />)
            }
          </div>
          
          {/* This is the simplest way of parsing an html string into a component. */}
          <article dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

export default JobCard;