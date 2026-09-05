import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { jobsApi } from '../../api_services/jobs/JobsApiService';
import CompanyLayout from '../../components/company/CompanyLayout';
import JobForm from '../../components/company/JobForm';

import type { CreateJobRequest } from '../../types/jobs/CreateJobRequest';
import type { JobFormData } from '../../types/jobs/JobFormData';

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (form: JobFormData) => {
    const request: CreateJobRequest = {
      title: form.title,
      description: form.description,
      location: form.location,
      experienceLevel: form.experienceLevel,
      jobCategory: form.jobCategory,
      employmentType: form.employmentType,
      expiresAt: new Date(form.expiresAt).toISOString(),
      skills: form.skills,
      salaryMin: form.salaryMin
        ? Number(form.salaryMin)
        : null,
      salaryMax: form.salaryMax
        ? Number(form.salaryMax)
        : null,
    };

    try {
      setLoading(true);
      await jobsApi.createJob(request);
      navigate('/my-jobs');
    } catch {
      setError('Oglas nije moguće kreirati.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout>

      {error && <p>{error}</p>}

      <JobForm
        loading={loading}
        submitLabel="Objavi oglas"
        onSubmit={(form) => void handleSubmit(form)}
      />
    </CompanyLayout>
  );
}