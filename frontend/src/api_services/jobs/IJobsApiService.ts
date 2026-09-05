import type { JobListing } from '../../models/jobs/JobListing';
import type { CreateJobRequest } from '../../types/jobs/CreateJobRequest';
import type { UpdateJobRequest } from '../../types/jobs/UpdateJobRequest';

export interface IJobsApiService {
  getMyJobs(): Promise<JobListing[]>;
  getJobById(jobId: string): Promise<JobListing>;
  createJob(request: CreateJobRequest): Promise<JobListing>;
  updateJob(
    jobId: string,
    request: UpdateJobRequest
  ): Promise<JobListing>;
  closeJob(jobId: string): Promise<void>;
}