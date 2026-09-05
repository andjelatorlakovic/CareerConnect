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
      <div className="details-page">

        <div className="details-container">

          {/* BACK */}

          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/my-jobs')}
          >
            <span>←</span>
            Moji oglasi
          </button>

          {/* HEADER */}

          <div className="job-header">

            <div className="job-header-main">

              <div className="job-icon">
                💼
              </div>

              <div className="job-heading">

                <div className="job-title-row">

                  <h1>{job.title}</h1>

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

                <p>
                  Detalji i informacije o oglasu
                </p>

              </div>

            </div>

            <div className="expiration-card">

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

          <div className="management-panel">

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

            <div className="management-actions">

              <button
                type="button"
                className="management-button"
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
                className="management-button"
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
                className="management-button"
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
                  className="close-button"
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

            <main className="details-main">

              {/* BASIC INFORMATION */}

              <section className="content-section">

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

                <div className="info-grid">

                  <div className="info-card pink-card">

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

                  <div className="info-card purple-card">

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

                  <div className="info-card blue-card">

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

                  <div className="info-card green-card">

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

                  <div className="info-card salary-card">

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

                  <div className="info-card date-card">

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
      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* PAGE */

        .details-page {
          width: 100%;
          min-height: 92vh;

          padding: 2.5% 4%;

          background: #19182d;
        }

        .details-container {
          width: 100%;

          padding: 2.5% 3%;

          background: #ffffff;

          border: 1px solid #dedde8;
          border-radius: 20px;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.15);
        }

        /* BACK */

        .back-button {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          width: fit-content;

          gap: 0.5rem;

          margin: 0 0 1.4rem 0;
          padding: 0;

          border: none;

          background: transparent;

          color: #777785;

          font-family: inherit;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .back-button span {
          color: #ef476f;

          font-size: 21px;
          line-height: 1;

          transition:
            transform 0.2s ease;
        }

        .back-button:hover {
          color: #ef476f;
        }

        .back-button:hover span {
          transform: translateX(-4px);
        }

        /* HEADER */

        .job-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 3%;

          padding-bottom: 2%;

          border-bottom: 1px solid #e8e6ef;
        }

        .job-header-main {
          display: flex;
          align-items: center;

          gap: 1.2rem;

          min-width: 0;
        }

        .job-icon {
          width: 62px;
          height: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background:
            linear-gradient(
              135deg,
              #f8dce4,
              #eee9f8
            );

          border-radius: 16px;

          font-size: 28px;

          box-shadow:
            inset 0 0 0 1px
            rgba(239, 71, 111, 0.08);
        }

        .job-heading {
          min-width: 0;
        }

        .job-title-row {
          display: flex;
          align-items: center;

          gap: 0.8rem;

          flex-wrap: wrap;
        }

        .job-title-row h1 {
          margin: 0;

          color: #333344;

          font-size: clamp(
            24px,
            2.3vw,
            36px
          );

          font-weight: 800;

          letter-spacing: -0.7px;
        }

        .job-heading p {
          margin: 0.45rem 0 0;

          color: #858592;

          font-size: 14px;
        }

        /* STATUS */

        .status {
          display: inline-flex;
          align-items: center;

          gap: 0.4rem;

          padding: 0.35rem 0.75rem;

          border-radius: 20px;

          font-size: 12px;
          font-weight: 700;
        }

        .status.active {
          background: #eaf7ef;
          color: #278653;
        }

        .status.closed {
          background: #eeeeF3;
          color: #777785;
        }

        .status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: currentColor;
        }

        /* EXPIRATION */

        .expiration-card {
          display: flex;
          flex-direction: column;

          align-items: flex-end;

          gap: 0.25rem;

          padding: 0.8rem 1.1rem;

          background: #f5f1f8;

          border: 1px solid #e5ddea;

          border-radius: 11px;

          flex-shrink: 0;
        }

        .expiration-label {
          color: #9895a4;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.7px;
        }

        .expiration-card strong {
          color: #403c55;

          font-size: 14px;
        }

        /* MANAGEMENT */

        .management-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 2%;

          margin: 1.5rem 0;

          padding: 0.9rem 1.1rem;

          background:
            linear-gradient(
              120deg,
              #24233d,
              #302f4b
            );

          border-radius: 14px;

          box-shadow:
            0 8px 18px
            rgba(36, 35, 61, 0.12);
        }

        .management-info {
          display: flex;
          align-items: center;

          gap: 0.8rem;

          min-width: 0;
        }

        .management-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background:
            rgba(239, 71, 111, 0.14);

          border:
            1px solid
            rgba(239, 71, 111, 0.25);

          border-radius: 10px;

          color: #ff7e9b;

          font-size: 18px;
        }

        .management-info h2 {
          margin: 0;

          color: #ffffff;

          font-size: 15px;
          font-weight: 700;
        }

        .management-info p {
          margin: 0.2rem 0 0;

          color: #b7b5c6;

          font-size: 12px;
        }

        .management-actions {
          display: flex;
          align-items: center;

          gap: 0.55rem;

          flex-wrap: wrap;

          justify-content: flex-end;
        }

        .management-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 0.45rem;

          padding: 0.62rem 0.85rem;

          border:
            1px solid #484662;

          border-radius: 8px;

          background: #302f4b;
          color: #eeeef4;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .management-button:hover {
          background: #ef476f;

          border-color: #ef476f;

          color: #ffffff;

          transform: translateY(-1px);
        }

        .button-icon {
          font-size: 15px;
          line-height: 1;
        }

        .close-button {
          padding: 0.62rem 0.85rem;

          border:
            1px solid
            rgba(239, 71, 111, 0.4);

          border-radius: 8px;

          background:
            rgba(239, 71, 111, 0.08);

          color: #ff9ab0;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .close-button:hover {
          background: #ef476f;

          border-color: #ef476f;

          color: #ffffff;
        }

        .close-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* CONTENT */

        .details-content {
          width: 100%;
        }

        .details-main {
          width: 100%;
        }

        .content-section {
          padding: 1.2rem 0;

          border-bottom:
            1px solid #ebe9f1;
        }

        .content-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        /* SECTION HEADING */

        .section-heading {
          display: flex;
          align-items: flex-start;

          gap: 0.8rem;

          margin-bottom: 1rem;
        }

        .section-accent {
          width: 4px;
          min-height: 38px;

          flex-shrink: 0;

          background: #ef476f;

          border-radius: 5px;
        }

        .section-heading h2 {
          margin: 0;

          color: #3b3a4b;

          font-size: 17px;
          font-weight: 800;
        }

        .section-heading p {
          margin: 0.25rem 0 0;

          color: #92919e;

          font-size: 12px;
        }

        /* INFO GRID */

        .info-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 0.75rem;
        }

        .info-card {
          display: flex;
          align-items: center;

          gap: 0.75rem;

          min-width: 0;

          padding: 0.85rem;

          border: 1px solid;

          border-radius: 11px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .info-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 6px 14px
            rgba(48, 42, 75, 0.07);
        }

        .pink-card {
          background: #fff4f6;
          border-color: #f6d5dc;
        }

        .purple-card {
          background: #f6f3fb;
          border-color: #e3dcef;
        }

        .blue-card {
          background: #f1f5fb;
          border-color: #dbe4f1;
        }

        .green-card {
          background: #f0f8f3;
          border-color: #d6eadc;
        }

        .salary-card {
          background: #f8f5ed;
          border-color: #ebe2cb;
        }

        .date-card {
          background: #f5f3f8;
          border-color: #e2dfea;
        }

        .info-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background:
            rgba(255, 255, 255, 0.75);

          border-radius: 9px;

          font-size: 17px;
        }

        .info-card > div {
          min-width: 0;
        }

        .info-label {
          display: block;

          margin-bottom: 0.2rem;

          color: #92919e;

          font-size: 10px;
          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.4px;
        }

        .info-card strong {
          display: block;

          overflow: hidden;

          color: #454455;

          font-size: 13px;
          font-weight: 700;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        /* DESCRIPTION */

        .description-card {
          padding: 1rem 1.1rem;

          background: #f7f6fa;

          border:
            1px solid #e7e5ed;

          border-radius: 11px;
        }

        .description-card p {
          margin: 0;

          color: #5e5d6c;

          font-size: 14px;

          line-height: 1.7;

          white-space: pre-line;
        }

        /* SKILLS */

        .skills-container {
          display: flex;

          flex-wrap: wrap;

          gap: 0.5rem;
        }

        .skill-tag {
          display: inline-flex;
          align-items: center;

          padding: 0.45rem 0.75rem;

          background: #fcebf0;

          border:
            1px solid #f3ccd7;

          border-radius: 20px;

          color: #c8385c;

          font-size: 12px;
          font-weight: 700;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .skill-tag:hover {
          background: #ef476f;

          color: #ffffff;

          transform: translateY(-1px);
        }

        .no-skills {
          padding: 0.9rem 1rem;

          background: #f7f6fa;

          border-radius: 9px;

          color: #888794;

          font-size: 13px;
        }

        /* ACTION ERROR */

        .action-error {
          display: flex;
          align-items: center;

          gap: 0.6rem;

          margin-top: 1rem;

          padding: 0.8rem 1rem;

          background: #fff1f4;

          border:
            1px solid #f3c8d2;

          border-radius: 9px;

          color: #9a3d53;

          font-size: 13px;
        }

        .action-error span {
          width: 22px;
          height: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: #ef476f;

          color: #ffffff;

          border-radius: 50%;

          font-size: 12px;
          font-weight: 800;
        }

        /* LOADING */

        .loading-container {
          width: 100%;

          min-height: 80vh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          color: #c4c2cf;
        }

        .spinner {
          width: 38px;
          height: 38px;

          margin-bottom: 1rem;

          border:
            4px solid #3a3855;

          border-top-color: #ef476f;

          border-radius: 50%;

          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ERROR */

        .error-container {
          min-height: 80vh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;
        }

        .error-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 1rem;

          background: #ef476f;

          color: #ffffff;

          border-radius: 50%;

          font-size: 22px;
          font-weight: 800;
        }

        .error-container h2 {
          margin: 0;

          color: #333344;

          font-size: 22px;
        }

        .error-container p {
          margin: 0.5rem 0 1.3rem;

          color: #858592;

          font-size: 14px;
        }

        .back-main-button {
          padding: 0.7rem 1.2rem;

          border: none;

          border-radius: 9px;

          background: #ef476f;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .back-main-button:hover {
          background: #d9365f;

          transform: translateY(-1px);
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .details-page {
            padding: 2.5% 3%;
          }

          .job-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .expiration-card {
            align-items: flex-start;
          }

          .management-panel {
            align-items: flex-start;

            flex-direction: column;
          }

          .management-actions {
            width: 100%;

            justify-content: flex-start;
          }

          .info-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 650px) {

          .details-page {
            padding: 0;
          }

          .details-container {
            min-height: 92vh;

            padding: 5%;

            border-radius: 0;

            border-left: none;
            border-right: none;
          }

          .back-button {
            margin-bottom: 1.2rem;
          }

          .job-header-main {
            align-items: flex-start;
          }

          .job-icon {
            width: 50px;
            height: 50px;

            border-radius: 12px;

            font-size: 23px;
          }

          .job-title-row h1 {
            font-size: 24px;
          }

          .management-panel {
            padding: 1rem;
          }

          .management-info {
            width: 100%;
          }

          .management-actions {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            width: 100%;
          }

          .management-button,
          .close-button {
            width: 100%;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .content-section {
            padding: 1rem 0;
          }

        }

        @media (max-width: 430px) {

          .job-header-main {
            gap: 0.8rem;
          }

          .job-icon {
            width: 45px;
            height: 45px;

            font-size: 20px;
          }

          .job-title-row h1 {
            font-size: 21px;
          }

          .status {
            font-size: 11px;
          }

          .expiration-card {
            width: 100%;
          }

          .management-actions {
            grid-template-columns: 1fr;
          }

          .section-heading h2 {
            font-size: 16px;
          }

          .description-card p {
            font-size: 13px;
          }

        }

      `}</style>
    </CompanyLayout>
  );
}