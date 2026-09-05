import type { JobApplication } from '../../models/applications/JobApplication';
import type { UpdateApplicationStatusRequest } from '../../types/applications/UpdateApplicationStatusRequest';

export interface IJobApplicationsApiService {
  getApplicationsForJob(
    jobId: string
  ): Promise<JobApplication[]>;

  updateApplicationStatus(
    applicationId: string,
    request: UpdateApplicationStatusRequest
  ): Promise<JobApplication>;
}