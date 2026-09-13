import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { jobsApi } from '../../api_services/jobs/JobsApiService';
import { quizApi } from '../../api_services/quiz/QuizApiService';
import { jobApplicationsApi } from '../../api_services/applications/JobApplicationsApiService';

import type { JobListing } from '../../models/jobs/JobListing';
import type { JobListingQuestion } from '../../models/quiz/JobListingQuestion';
import type { CreateJobApplicationRequest } from '../../types/applications/CreateJobApplicationRequest';

import { JobStatus } from '../../models/jobs/JobStatus';

import CandidateLayout from '../../components/candidate/CandidateLayout';
import JobApplicationForm from '../../components/candidate/JobApplicationForm';

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<JobListing | null>(null);
  const [questions, setQuestions] =
    useState<JobListingQuestion[]>([]);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loadedId, setLoadedId] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  const loading = loadedId !== id || loadedId === undefined;

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        if (!id) {
          throw new Error('Missing job ID.');
        }

        const [jobData, questionData, applications] =
          await Promise.all([
            jobsApi.getJobById(id),
            quizApi.getJobQuestions(id),
            jobApplicationsApi.getMyApplications(),
          ]);

        if (active) {
          setJob(jobData);
          setQuestions(questionData);
          setError('');
          setSubmitError('');
          setSuccess('');

          setAlreadyApplied(
            applications.some(
              (application) => application.jobListingId === id
            )
          );
        }
      } catch {
        if (active) {
          setError('Job details could not be loaded.');
        }
      } finally {
        if (active) {
          setLoadedId(id ?? '');
        }
      }
    }

    void loadDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const canApply = Boolean(
    job &&
    job.status === JobStatus.Active &&
    new Date(job.expiresAt).getTime() > Date.now()
  );

  const handleApply = async (
    request: CreateJobApplicationRequest
  ) => {
    if (
      !job ||
      !id ||
      job.id !== id ||
      submitting ||
      alreadyApplied ||
      job.status !== JobStatus.Active ||
      !(new Date(job.expiresAt).getTime() > Date.now())
    ) {
      setSubmitError('Prijava trenutno nije dostupna.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      setSuccess('');

      await jobApplicationsApi.applyForJob(id, request);

      setAlreadyApplied(true);
      setSuccess('Your application was submitted successfully.');
    } catch {
      setSubmitError(
        'Your application could not be submitted. Check whether you have already applied or the job has expired.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="grid min-h-[86vh] content-start gap-7 rounded-[28px] border border-solid border-[#e3dfe8] bg-[#f7f7fb] p-4 shadow-xl sm:p-8">
        <Link
          to="/jobs"
          className="w-fit text-sm font-semibold text-[#c8385c] no-underline hover:underline"
        >
          ← All jobs
        </Link>

        {loading && id && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Loading job...
          </p>
        )}

        {(!id || (!loading && error)) && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {!id ? 'Job not found.' : error}
          </div>
        )}

        {!loading && !error && job && (
          <>
            <header className="relative isolate overflow-hidden rounded-3xl bg-[#24233d] p-6 sm:p-8">
              <h1 className="m-0 text-3xl font-bold tracking-tight break-words text-white">
                {job.title}
              </h1>

              <p className="m-0 mt-3 text-sm leading-relaxed text-[#d3d1e0]">
                {job.location} · {job.jobCategory}
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2 rounded-xl border border-solid border-[#e3dcef] bg-[#f6f3fb] p-4">
                <span className="text-xs text-[#92919e]">Nivo iskustva</span>
                <strong>{job.experienceLevel}</strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#dbe4f1] bg-[#f1f5fb] p-4">
                <span className="text-xs text-[#92919e]">Tip zaposlenja</span>
                <strong>{job.employmentType}</strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#d6eadc] bg-[#f0f8f3] p-4">
                <span className="text-xs text-[#92919e]">Published on</span>

                <strong>
                  {new Date(job.createdAt)
                    .toLocaleDateString('sr-Latn-RS')}
                </strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#ebe2cb] bg-[#f8f5ed] p-4">
                <span className="text-xs text-[#92919e]">Salary</span>

                <strong>
                  {job.salaryMin !== null && job.salaryMax !== null
                    ? `${job.salaryMin.toLocaleString('sr-Latn-RS')} – ${job.salaryMax.toLocaleString('sr-Latn-RS')}`
                    : job.salaryMin !== null
                      ? `Od ${job.salaryMin.toLocaleString('sr-Latn-RS')}`
                      : job.salaryMax !== null
                        ? `Do ${job.salaryMax.toLocaleString('sr-Latn-RS')}`
                        : 'Nije navedena'}
                </strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#f6d5dc] bg-[#fff4f6] p-4">
                <span className="text-xs text-[#92919e]">Application deadline</span>

                <strong>
                  {new Date(job.expiresAt)
                    .toLocaleDateString('sr-Latn-RS')}
                </strong>
              </div>
            </div>

            <section className="grid gap-4 rounded-xl border border-solid border-[#e7e5ed] bg-[#f7f6fa] p-5">
              <h2 className="m-0 text-lg font-bold text-[#333344]">
                Job description
              </h2>

              <p className="m-0 text-sm leading-relaxed whitespace-pre-wrap break-words text-[#5e5d6c]">
                {job.description}
              </p>
            </section>

            <section className="grid gap-4">
              <h2 className="m-0 text-lg font-bold text-[#333344]">
                Required skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-solid border-[#f3ccd7] bg-[#fcebf0] px-3 py-2 text-xs font-semibold text-[#c8385c]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {job.skills.length === 0 && (
                <p className="m-0 text-sm text-[#858592]">
                  No skills listed.
                </p>
              )}
            </section>

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
              >
                {submitError}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-lg border border-solid border-[#d5ebdd] bg-[#edf8f1] p-4 text-[#287648]"
              >
                {success}
              </div>
            )}

            {alreadyApplied ? (
              <section className="grid gap-4 rounded-xl border border-solid border-[#d9d9e2] bg-[#fafafd] p-5">
                <h2 className="m-0 text-lg font-bold text-[#333344]">
                  You have already applied
                </h2>

                <Link
                  to="/my-applications"
                  className="w-fit rounded-lg bg-[#ef476f] px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-[#df3d65]"
                >
                  My Applications
                </Link>
              </section>
            ) : canApply ? (
              <section className="grid gap-5 rounded-xl border border-solid border-[#d9d9e2] bg-[#fafafd] p-5">
                <h2 className="m-0 text-lg font-bold text-[#333344]">
                  Apply for this job
                </h2>

                <JobApplicationForm
                  key={job.id}
                  questions={questions}
                  loading={submitting}
                  onSubmit={handleApply}
                />
              </section>
            ) : (
              <div className="rounded-xl bg-[#f7f6fa] p-5 text-sm text-[#858592]">
                This job is closed or the application deadline has passed.
              </div>
            )}
          </>
        )}
      </div>
    </CandidateLayout>
  );
}
