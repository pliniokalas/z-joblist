export interface IJob {
  jobTitle: string;
  companyName: string;
  jobDescription: string; // The requirements said "shortDesc" but the API does not return this field.
  snippets: string[]; // The closest I could find to "shortDesc".
  jobLevels: string[];
  requiredDegree: string|null;
  estimatedSalary: string;
  postingDate: string;
  postedDate: string;
}