import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { jobsApi } from '../../api_services/jobs/JobsApiService';
import CompanyLayout from '../../components/company/CompanyLayout';

import type { JobListing } from '../../models/jobs/JobListing';
import { JobStatus } from '../../models/jobs/JobStatus';

export default function MyJobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) {
        setError('Oglas nije pronađen.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await jobsApi.getJobById(id);
        setJob(data);
      } catch {
        setError('Oglas nije moguće učitati.');
      } finally {
        setLoading(false);
      }
    };

    void loadJob();
  }, [id]);

  const handleClose = async () => {
    if (!job) {
      return;
    }

    const confirmed = window.confirm(
      'Da li ste sigurni da želite da zatvorite ovaj oglas?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setClosing(true);
      setError('');

      await jobsApi.closeJob(job.id);

      setJob({
        ...job,
        status: JobStatus.Closed,
      });
    } catch {
      setError('Oglas nije moguće zatvoriti.');
    } finally {
      setClosing(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatSalary = (
    salaryMin: number | null,
    salaryMax: number | null
  ) => {
    if (salaryMin === null && salaryMax === null) {
      return 'Nije navedeno';
    }

    if (salaryMin !== null && salaryMax !== null) {
      return `${salaryMin.toLocaleString(
        'sr-RS'
      )} - ${salaryMax.toLocaleString('sr-RS')} RSD`;
    }

    if (salaryMin !== null) {
      return `Od ${salaryMin.toLocaleString('sr-RS')} RSD`;
    }

    return `Do ${salaryMax!.toLocaleString('sr-RS')} RSD`;
  };

  if (loading) {
    return (
      <CompanyLayout>
        <div className="details-page">
          <div className="loading-container">
            <div className="spinner" />
            <p>Učitavanje oglasa...</p>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  if (error || !job) {
    return (
      <CompanyLayout>
        <div className="details-page">
          <div className="details-container error-container">
            <div className="error-icon">!</div>

            <h2>Oglas nije dostupan</h2>

            <p>
              {error || 'Traženi oglas nije pronađen.'}
            </p>

            <button
              type="button"
              className="back-main-button"
              onClick={() => navigate('/my-jobs')}
            >
              Nazad na oglase
            </button>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  const isActive = job.status === JobStatus.Active;

  return (
    <CompanyLayout>
      <div className="details-page !min-h-0 !bg-transparent !p-0">

        <div className="details-container !min-h-[86vh] !rounded-[28px] !border !border-solid !border-[#e3dfe8] !bg-[#f7f7fb] !p-4 !shadow-xl sm:!p-8">

          {/* BACK */}

          <button
            type="button"
            className="back-button !mb-5 !inline-flex !items-center !gap-2 !border-0 !bg-transparent !p-0 !font-semibold !text-[#c8385c] hover:!underline"
            onClick={() => navigate('/my-jobs')}
          >
            <span>←</span>
            Moji oglasi
          </button>

          {/* HEADER */}

          <div className="job-header !flex !flex-col !gap-5 !rounded-3xl !border-0 !bg-[#24233d] !p-6 sm:!flex-row sm:!items-center sm:!justify-between sm:!p-8">

            <div className="job-header-main !flex !items-center !gap-4">

              <div className="job-icon !grid !size-12 !place-items-center !rounded-2xl !bg-[#ef476f] !text-xl">
                💼
              </div>

              <div className="job-heading">

                <div className="job-title-row !flex !flex-wrap !items-center !gap-3">

                  <h1 className="!m-0 !text-3xl !font-bold !tracking-tight !text-white sm:!text-4xl">{job.title}</h1>

                  <span
                    className={
                      isActive
                        ? 'status active'
                        : 'status closed'
                    }
                  >
                    <span className="status-dot" />

                    {isActive
                      ? 'Aktivan'
                      : 'Zatvoren'}
                  </span>

                </div>

                <p className="!mb-0 !mt-2 !text-[#d3d1e0]">
                  Detalji i informacije o oglasu
                </p>

              </div>

            </div>

            <div className="expiration-card !rounded-2xl !bg-white/10 !px-5 !py-4 !text-white">

              <span className="expiration-label">
                ROK ZA PRIJAVE
              </span>

              <strong>
                {job.expiresAt
                  ? formatDate(job.expiresAt)
                  : 'Nije naveden'}
              </strong>

            </div>

          </div>

          {/* MANAGEMENT */}

          <div className="management-panel !mt-6 !flex !flex-col !gap-5 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5 lg:!flex-row lg:!items-center lg:!justify-between">

            <div className="management-info">

              <div className="management-icon">
                ⚙
              </div>

              <div>
                <h2>Upravljanje oglasom</h2>

                <p>
                  Izaberite akciju koju želite da izvršite
                </p>
              </div>

            </div>

            <div className="management-actions !flex !flex-wrap !gap-3">

              <button
                type="button"
                className="management-button !rounded-xl !border-0 !bg-[#ef476f] !px-4 !py-3 !font-semibold !text-white hover:!bg-[#d9365f]"
                onClick={() =>
                  navigate(`/edit-job/${job.id}`)
                }
              >
                <span className="button-icon">
                  ✎
                </span>

                <span>
                  Uredi oglas
                </span>
              </button>

              <button
                type="button"
                className="management-button !rounded-xl !border-0 !bg-[#ef476f] !px-4 !py-3 !font-semibold !text-white hover:!bg-[#d9365f]"
                onClick={() =>
                  navigate(
                    `/my-jobs/${job.id}/applications`
                  )
                }
              >
                <span className="button-icon">
                  👥
                </span>

                <span>
                  Prijave
                </span>
              </button>

              <button
                type="button"
                className="management-button !rounded-xl !border-0 !bg-[#ef476f] !px-4 !py-3 !font-semibold !text-white hover:!bg-[#d9365f]"
                onClick={() =>
                  navigate(
                    `/my-jobs/${job.id}/questions`
                  )
                }
              >
                <span className="button-icon">
                  ?
                </span>

                <span>
                  Pitanja
                </span>
              </button>

              {isActive && (
                <button
                  type="button"
                  className="close-button !rounded-xl !border !border-solid !border-[#f0c4d0] !bg-[#fff3f6] !px-4 !py-3 !font-semibold !text-[#c8385c] hover:!bg-[#fce5ec] disabled:!opacity-60"
                  onClick={() => void handleClose()}
                  disabled={closing}
                >
                  {closing
                    ? 'Zatvaranje...'
                    : 'Zatvori oglas'}
                </button>
              )}

            </div>

          </div>

          {/* MAIN CONTENT */}

          <div className="details-content">

            <main className="details-main !grid !gap-5">

              {/* BASIC INFORMATION */}

              <section className="content-section !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5">

                <div className="section-heading">

                  <div className="section-accent" />

                  <div>
                    <h2>
                      Osnovne informacije
                    </h2>

                    <p>
                      Informacije o poziciji i uslovima rada
                    </p>
                  </div>

                </div>

                <div className="info-grid !grid !grid-cols-1 !gap-3 sm:!grid-cols-2 lg:!grid-cols-3">

                  <div className="info-card pink-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      📍
                    </span>

                    <div>
                      <span className="info-label">
                        Lokacija
                      </span>

                      <strong>
                        {job.location}
                      </strong>
                    </div>

                  </div>

                  <div className="info-card purple-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      💼
                    </span>

                    <div>
                      <span className="info-label">
                        Tip zaposlenja
                      </span>

                      <strong>
                        {job.employmentType}
                      </strong>
                    </div>

                  </div>

                  <div className="info-card blue-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      🎓
                    </span>

                    <div>
                      <span className="info-label">
                        Iskustvo
                      </span>

                      <strong>
                        {job.experienceLevel}
                      </strong>
                    </div>

                  </div>

                  <div className="info-card green-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      🏷
                    </span>

                    <div>
                      <span className="info-label">
                        Kategorija
                      </span>

                      <strong>
                        {job.jobCategory}
                      </strong>
                    </div>

                  </div>

                  <div className="info-card salary-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      💰
                    </span>

                    <div>
                      <span className="info-label">
                        Plata
                      </span>

                      <strong>
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="info-card date-card !flex !items-center !gap-3 !rounded-xl !border !border-solid !border-[#e6e2eb] !bg-[#f8f8fc] !p-4">

                    <span className="info-icon">
                      📅
                    </span>

                    <div>
                      <span className="info-label">
                        Rok za prijavu
                      </span>

                      <strong>
                        {job.expiresAt
                          ? formatDate(job.expiresAt)
                          : 'Nije naveden'}
                      </strong>
                    </div>

                  </div>

                </div>

              </section>

              {/* DESCRIPTION */}

              <section className="content-section">

                <div className="section-heading">

                  <div className="section-accent" />

                  <div>
                    <h2>
                      Opis pozicije
                    </h2>

                    <p>
                      Detaljan opis radnog mesta
                    </p>
                  </div>

                </div>

                <div className="description-card">

                  <p>
                    {job.description}
                  </p>

                </div>

              </section>

              {/* SKILLS */}

              <section className="content-section">

                <div className="section-heading">

                  <div className="section-accent" />

                  <div>
                    <h2>
                      Potrebne veštine
                    </h2>

                    <p>
                      Veštine i tehnologije koje kandidat treba da poseduje
                    </p>
                  </div>

                </div>

                {job.skills && job.skills.length > 0 ? (

                  <div className="skills-container">

                    {job.skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="skill-tag"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                ) : (

                  <div className="no-skills">
                    Nisu navedene posebne veštine.
                  </div>

                )}

              </section>

            </main>

          </div>

          {error && (
            <div className="action-error">
              <span>!</span>
              {error}
            </div>
          )}

        </div>
      </div>    </CompanyLayout>
  );
}
