import api from '../axios/AxiosInstance';

import type { JobListing } from '../../models/jobs/JobListing';
import type { CreateJobRequest } from '../../types/jobs/CreateJobRequest';
import type { UpdateJobRequest } from '../../types/jobs/UpdateJobRequest';
import type { IJobsApiService } from './IJobsApiService';

export const jobsApi: IJobsApiService = {
  async getMyJobs() {
    return (await api.get<JobListing[]>('/jobs/my')).data;
  },

  async getJobById(jobId) {
    return (await api.get<JobListing>(`/jobs/${jobId}`)).data;
  },

  async createJob(request: CreateJobRequest) {
    return (await api.post<JobListing>('/jobs', request)).data;
  },

  async updateJob(
    jobId: string,
    request: UpdateJobRequest
  ) {
    return (
      await api.put<JobListing>(`/jobs/${jobId}`, request)
    ).data;
  },

  async closeJob(jobId: string) {
    await api.patch(`/jobs/${jobId}/close`);
  },
};