import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { jobsApi } from '../../api_services/jobs/JobsApiService';
import CompanyLayout from '../../components/company/CompanyLayout';

import type { JobListing } from '../../models/jobs/JobListing';
import { JobStatus } from '../../models/jobs/JobStatus';

export default function MyJobsPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await jobsApi.getMyJobs();
        setJobs(data);
      } catch {
        setError('Oglasi se ne mogu učitati.');
      } finally {
        setLoading(false);
      }
    };

    void loadJobs();
  }, []);

  const activeJobs = jobs.filter(
    (job) => job.status === JobStatus.Active
  ).length;
  const inactiveJobs = jobs.length - activeJobs;

  return (
    <CompanyLayout>
      <div className="jobs-page !min-h-0 !bg-transparent !p-0">

        <div className="jobs-container !min-h-[86vh] !rounded-[28px] !border !border-solid !border-[#e3dfe8] !bg-[#f7f7fb] !p-4 !shadow-xl sm:!p-8">

          {/* HEADER */}

          <div className="jobs-header !flex !flex-col !items-start !justify-between !gap-5 !rounded-3xl !bg-[#24233d] !p-6 sm:!flex-row sm:!items-center sm:!p-8">

            <div className="header-left !flex !items-center !gap-4">

              <div>

                <div className="title-row !flex !items-center !gap-3">

                  <h1 className="!m-0 !text-3xl !font-bold !tracking-tight !text-white sm:!text-4xl">
                    My Jobs
                  </h1>

                </div>

                <p className="!mb-0 !mt-2 !text-base !text-[#d3d1e0]">
                  Pregled i upravljanje oglasima vaše kompanije.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="add-job-button !inline-flex !items-center !gap-2 !rounded-xl !border-0 !bg-[#ef476f] !px-7 !py-4 !text-base !font-bold !text-white hover:!bg-[#d9365f]"
              onClick={() =>
                navigate('/create-job')
              }
            >
              <span className="plus-icon">
                +
              </span>

              Novi oglas
            </button>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="state-container !grid !min-h-72 !place-items-center !gap-3 !text-[#666576]">

              <div className="spinner" />

              <p>
                Učitavanje oglasa...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="error-container !mt-6 !flex !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#f0c4d0] !bg-[#fff3f6] !p-5 !text-[#a43651]">

              <div className="error-icon">
                !
              </div>

              <div>

                <strong>
                  Došlo je do greške
                </strong>

                <p>
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div className="empty-container !mx-auto !mt-10 !grid !max-w-xl !justify-items-center !gap-3 !rounded-2xl !border !border-dashed !border-[#d9d9e2] !bg-white !p-10 !text-center">

                <div className="empty-icon">
                  <span>＋</span>
                </div>

                <h2 className="!m-0 !text-xl !font-bold !text-[#333344]">
                  Još nemate oglasa
                </h2>

                <p className="!m-0 !text-[#777686]">
                  Objavite prvi oglas i pronađite
                  odgovarajuće kandidate.
                </p>

                <button
                  type="button"
                  className="!mt-2 !inline-flex !items-center !gap-2 !rounded-xl !border-0 !bg-[#ef476f] !px-5 !py-3 !font-bold !text-white hover:!bg-[#d9365f]"
                  onClick={() =>
                    navigate('/create-job')
                  }
                >
                  <span>
                    +
                  </span>

                  Objavi prvi oglas
                </button>

              </div>
            )}

          {/* JOBS */}

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div className="jobs-content">

                {/* STATISTICS */}

                <div className="stats-grid !mt-6 !grid !grid-cols-1 !gap-5 sm:!grid-cols-2 lg:[&.stats-grid]:!grid-cols-2">

                  {/* TOTAL */}

                  <div className="stat-card total-card !flex !min-h-24 !w-full !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-4 !shadow-sm">

                    <div className="stat-icon !grid !size-11 !place-items-center !rounded-xl !bg-[#e9f7ed] !text-xl !font-bold !text-[#2c7b48]">
                      <span>✓</span>
                    </div>

                    <div className="stat-info !flex !flex-col !items-start !justify-center !gap-2">

                      <span className="!block !text-xs !font-bold !uppercase !tracking-wide !text-[#858592]">
                        Ukupno aktivnih
                      </span>

                      <strong className="!block !text-2xl !font-bold !leading-none !text-[#2c7b48]">
                        {activeJobs}
                      </strong>

                    </div>

                  </div>

                  {/* ACTIVE */}

                  <div className="stat-card active-card !flex !min-h-24 !w-full !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-4 !shadow-sm">

                    <div className="stat-icon !grid !size-11 !place-items-center !rounded-xl !bg-[#fff2f4] !text-xl !font-bold !text-[#c8385c]">
                      <span>×</span>
                    </div>

                    <div className="stat-info !flex !flex-col !items-start !justify-center !gap-2">

                      <span className="!block !text-xs !font-bold !uppercase !tracking-wide !text-[#858592]">
                        Ukupno neaktivnih
                      </span>

                      <strong className="!block !text-2xl !font-bold !leading-none !text-[#c8385c]">
                        {inactiveJobs}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* LIST HEADER */}

                <div className="list-header !mt-8 !flex !flex-wrap !items-center !justify-between !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5">

                  <div>

                    <h2 className="!m-0 !text-xl !font-bold !text-[#333344]">
                      Objavljeni oglasi
                    </h2>

                    <span className="!mt-1 !block !text-sm !text-[#777686]">
                      Izaberite oglas za pregled detalja
                    </span>

                  </div>

                  <span className="job-count !rounded-full !bg-[#fce8ee] !px-3 !py-1 !text-sm !font-bold !text-[#c8385c]">
                    {jobs.length}{' '}
                    {jobs.length === 1
                      ? 'oglas'
                      : 'oglasa'}
                  </span>

                </div>

                {/* JOB LIST */}

                <div className="jobs-list !mt-4 !grid !gap-4">

                  {jobs.map((job) => {

                    const isActive =
                      job.status === JobStatus.Active;

                    return (
                      <article
                        key={job.id}
                        className="job-item !flex !cursor-pointer !overflow-hidden !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !shadow-sm !transition hover:!border-[#ef476f] hover:!shadow-md"
                        onClick={() =>
                          navigate(
                            `/my-jobs/${job.id}`
                          )
                        }
                        onKeyDown={(event) => {

                          if (
                            event.key === 'Enter' ||
                            event.key === ' '
                          ) {
                            navigate(
                              `/my-jobs/${job.id}`
                            );
                          }

                        }}
                        role="button"
                        tabIndex={0}
                      >

                        {/* DARK SIDE */}

                        <div
                          className={
                            isActive
                              ? 'job-side active-side'
                              : 'job-side closed-side'
                          }
                        >
                          <span className="job-symbol">
                            {isActive
                              ? '◆'
                              : '◇'}
                          </span>
                        </div>

                        {/* JOB CONTENT */}

                        <div className="job-main-info !min-w-0 !flex-1 !p-5">

                          <div className="job-title-row !flex !flex-wrap !items-center !gap-3">

                            <h3 className="!m-0 !text-lg !font-bold !text-[#333344]">
                              {job.title}
                            </h3>

                            {/* STATUS */}

                            <span
                              className={
                                isActive
                                  ? 'status-sticker active-sticker'
                                  : 'status-sticker closed-sticker'
                              }
                            >

                              <span className="sticker-dot" />

                              {isActive
                                ? 'AKTIVAN'
                                : 'ZATVOREN'}

                            </span>

                          </div>

                          {/* META */}

                          <div className="job-meta !mt-3 !flex !flex-wrap !gap-x-4 !gap-y-2 !text-sm !text-[#777686]">

                            <span>

                              <i className="meta-icon location">
                                ⌖
                              </i>

                              {job.location}

                            </span>

                            <span>

                              <i className="meta-icon type">
                                ◈
                              </i>

                              {job.employmentType}

                            </span>

                            <span>

                              <i className="meta-icon experience">
                                ◎
                              </i>

                              {job.experienceLevel}

                            </span>

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="job-details !flex !items-center !gap-2 !p-5 !font-semibold !text-[#c8385c]">

                          <span>
                            Detalji
                          </span>

                          <div className="job-arrow">
                            →
                          </div>

                        </div>

                      </article>
                    );
                  })}

                </div>

              </div>
            )}

        </div>

      </div>    </CompanyLayout>
  );
}
