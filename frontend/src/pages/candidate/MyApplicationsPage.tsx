import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { jobApplicationsApi } from '../../api_services/applications/JobApplicationsApiService';
import { jobsApi } from '../../api_services/jobs/JobsApiService';

import type { JobApplication } from '../../models/applications/JobApplication';
import type { JobListing } from '../../models/jobs/JobListing';

import { ApplicationStatus } from '../../models/applications/ApplicationStatus';

import CandidateLayout from '../../components/candidate/CandidateLayout';

const statusLabels: Record<ApplicationStatus, string> = {
  Pending: 'Na čekanju',
  Reviewed: 'Pregledana',
  Accepted: 'Prihvaćena',
  Rejected: 'Odbijena',
};

export default function MyApplicationsPage() {
  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  const [jobs, setJobs] =
    useState<Record<string, JobListing>>({});

  const [status, setStatus] =
    useState<ApplicationStatus | ''>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        const data =
          await jobApplicationsApi.getMyApplications();

        const jobIds = [
          ...new Set(data.map((item) => item.jobListingId)),
        ];

        const results = await Promise.allSettled(
          jobIds.map((id) => jobsApi.getJobById(id))
        );

        const loadedJobs: Record<string, JobListing> = {};

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            loadedJobs[jobIds[index]] = result.value;
          }
        });

        if (active) {
          setApplications(data);
          setJobs(loadedJobs);
        }
      } catch {
        if (active) {
          setError('Prijave se ne mogu učitati.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadApplications();

    return () => {
      active = false;
    };
  }, []);

  const visibleApplications = status
    ? applications.filter((item) => item.status === status)
    : applications;

  return (
    <CandidateLayout>
      <div className="grid min-h-[86vh] content-start gap-7 rounded-[28px] border border-solid border-[#e3dfe8] bg-[#f7f7fb] p-4 shadow-xl sm:p-8">
        <header className="relative isolate overflow-hidden rounded-3xl bg-[#24233d] p-6 sm:p-8">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Moje prijave
          </h1>

          <p className="m-0 mt-3 text-sm leading-relaxed text-[#d3d1e0]">
            Pratite svoje prijave i odgovore kompanija.
          </p>
        </header>

        {loading && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Učitavanje prijava...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <div className="grid gap-2 rounded-xl border border-solid border-[#e2deed] bg-[#f5f2fa] p-4">
                <span className="text-xs text-[#858092]">
                  Ukupno prijava
                </span>

                <strong className="text-2xl">{applications.length}</strong>
              </div>

              {Object.values(ApplicationStatus).map((item) => (
                <div
                  key={item}
                  className="grid gap-2 rounded-xl border border-solid border-[#e2deed] bg-[#f5f2fa] p-4"
                >
                  <span className="text-xs text-[#858092]">
                    {statusLabels[item]}
                  </span>

                  <strong className="text-2xl">
                    {
                      applications.filter(
                        (application) => application.status === item
                      ).length
                    }
                  </strong>
                </div>
              ))}
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Filtriraj po statusu

              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target.value as ApplicationStatus | ''
                  );
                }}
                className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f]"
              >
                <option value="">Sve prijave</option>

                {Object.values(ApplicationStatus).map((item) => (
                  <option key={item} value={item}>
                    {statusLabels[item]}
                  </option>
                ))}
              </select>
            </label>

            {visibleApplications.length === 0 ? (
              <div className="grid justify-items-center gap-4 py-10 text-center">
                <h2 className="m-0 text-lg font-bold text-[#333344]">
                  {applications.length === 0
                    ? 'Još nemate prijava'
                    : 'Nema prijava sa izabranim statusom'}
                </h2>

                <Link
                  to="/jobs"
                  className="rounded-lg bg-[#ef476f] px-5 py-3 font-semibold text-white no-underline hover:bg-[#df3d65]"
                >
                  Pronađi posao
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {visibleApplications.map((application) => {
                  const job = jobs[application.jobListingId];

                  return (
                    <article
                      key={application.id}
                      className="grid gap-4 rounded-xl border border-solid border-[#e3dfeb] border-l-4 border-l-[#24233d] bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="m-0 text-lg font-bold text-[#333344]">
                          {job?.title ?? 'Detalji oglasa nisu dostupni'}
                        </h2>

                        <span
                          className={
                            application.status === ApplicationStatus.Accepted
                              ? 'rounded-md bg-[#e9f7ed] px-3 py-2 text-xs font-bold text-[#2c7b48]'
                              : application.status === ApplicationStatus.Rejected
                                ? 'rounded-md bg-[#fff0f3] px-3 py-2 text-xs font-bold text-[#b63255]'
                                : application.status === ApplicationStatus.Reviewed
                                  ? 'rounded-md bg-[#edf2ff] px-3 py-2 text-xs font-bold text-[#4161a8]'
                                  : 'rounded-md bg-[#fff6df] px-3 py-2 text-xs font-bold text-[#896619]'
                          }
                        >
                          {statusLabels[application.status]}
                        </span>
                      </div>

                      <p className="m-0 text-xs text-[#858592]">
                        {job && `${job.location} · `}
                        Prijavljeno:{' '}
                        {new Date(application.appliedAt)
                          .toLocaleDateString('sr-Latn-RS')}
                      </p>

                      {application.coverLetter && (
                        <details>
                          <summary className="cursor-pointer text-sm font-semibold text-[#c8385c]">
                            Moje motivaciono pismo
                          </summary>

                          <p className="m-0 mt-3 text-sm leading-relaxed whitespace-pre-wrap break-words text-[#5e5d6c]">
                            {application.coverLetter}
                          </p>
                        </details>
                      )}

                      {job && (
                        <Link
                          to={`/jobs/${job.id}`}
                          className="w-fit rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-2 text-sm font-semibold text-[#c8385c] no-underline hover:bg-[#fce5ec]"
                        >
                          Pogledaj oglas
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </CandidateLayout>
  );
}
