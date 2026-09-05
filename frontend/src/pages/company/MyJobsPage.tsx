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

  return (
    <CompanyLayout>
      <div className="jobs-page">

        <div className="jobs-container">

          {/* HEADER */}

          <div className="jobs-header">

            <div className="header-left">

              <div className="header-icon">
                <span>▦</span>
              </div>

              <div>

                <div className="title-row">

                  <h1>
                    My Jobs
                  </h1>

                  {!loading &&
                    !error &&
                    jobs.length > 0 && (
                      <span className="total-badge">
                        {jobs.length}
                      </span>
                    )}

                </div>

                <p>
                  Pregled i upravljanje oglasima vaše kompanije.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="add-job-button"
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
            <div className="state-container">

              <div className="spinner" />

              <p>
                Učitavanje oglasa...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="error-container">

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
              <div className="empty-container">

                <div className="empty-icon">
                  <span>＋</span>
                </div>

                <h2>
                  Još nemate oglasa
                </h2>

                <p>
                  Objavite prvi oglas i pronađite
                  odgovarajuće kandidate.
                </p>

                <button
                  type="button"
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

                <div className="stats-grid">

                  {/* TOTAL */}

                  <div className="stat-card total-card">

                    <div className="stat-icon">
                      <span>▤</span>
                    </div>

                    <div className="stat-info">

                      <span>
                        Ukupno oglasa
                      </span>

                      <strong>
                        {jobs.length}
                      </strong>

                    </div>

                  </div>

                  {/* ACTIVE */}

                  <div className="stat-card active-card">

                    <div className="stat-icon">
                      <span>✓</span>
                    </div>

                    <div className="stat-info">

                      <span>
                        Aktivni oglasi
                      </span>

                      <strong>
                        {activeJobs}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* LIST HEADER */}

                <div className="list-header">

                  <div>

                    <h2>
                      Objavljeni oglasi
                    </h2>

                    <span>
                      Izaberite oglas za pregled detalja
                    </span>

                  </div>

                  <span className="job-count">
                    {jobs.length}{' '}
                    {jobs.length === 1
                      ? 'oglas'
                      : 'oglasa'}
                  </span>

                </div>

                {/* JOB LIST */}

                <div className="jobs-list">

                  {jobs.map((job) => {

                    const isActive =
                      job.status === JobStatus.Active;

                    return (
                      <article
                        key={job.id}
                        className="job-item"
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

                        <div className="job-main-info">

                          <div className="job-title-row">

                            <h3>
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

                          <div className="job-meta">

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

                        <div className="job-details">

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

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* ========================================
           PAGE
        ======================================== */

        .jobs-page {
          width: 100%;
          min-height: 92vh;

          padding: 2.2% 4%;

          background: #19182d;
        }

        /* ========================================
           CONTAINER
        ======================================== */

        .jobs-container {
          width: 100%;
          min-height: 86vh;

          padding: 2.4% 3.2%;

          background: #ffffff;

          border: 1px solid #dedde8;

          border-radius: 20px;

          box-shadow:
            0 16px 40px
            rgba(0, 0, 0, 0.18);
        }

        /* ========================================
           HEADER
        ======================================== */

        .jobs-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 2rem;

          padding-bottom: 1.5rem;

          border-bottom:
            1px solid #ebe9f1;
        }

        .header-left {
          display: flex;

          align-items: center;

          gap: 1rem;

          min-width: 0;
        }

        .header-icon {
          width: 56px;
          height: 56px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: #24233d;

          border-radius: 15px;

          color: #f4d8e0;

          font-size: 27px;

          box-shadow:
            0 6px 15px
            rgba(36, 35, 61, 0.18);
        }

        /* ========================================
           TITLE
        ======================================== */

        .title-row {
          display: flex;

          align-items: center;

          gap: 0.65rem;
        }

        .jobs-header h1 {
          margin: 0;

          color: #ef476f;

          font-size: clamp(
            30px,
            3vw,
            44px
          );

          font-weight: 700;

          letter-spacing: -1.5px;
        }

        .total-badge {
          min-width: 27px;
          height: 27px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          padding: 0 0.45rem;

          background: #fce8ee;

          border: 1px solid #f2ccd8;

          border-radius: 50%;

          color: #c8385c;

          font-size: 11px;

          font-weight: 800;
        }

        .jobs-header p {
          margin: 0.7% 0 0;

          color: #8c8c9a;

          font-size: clamp(
            14px,
            1.2vw,
            17px
          );
        }

        /* ========================================
           ADD BUTTON
        ======================================== */

        .add-job-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 0.55rem;

          padding: 0.75rem 1.15rem;

          border: none;

          border-radius: 9px;

          background: #ef476f;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          white-space: nowrap;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .plus-icon {
          font-size: 18px;

          line-height: 1;
        }

        .add-job-button:hover {
          background: #d9365f;

          transform: translateY(-2px);

          box-shadow:
            0 7px 16px
            rgba(239, 71, 111, 0.28);
        }

        /* ========================================
           CONTENT
        ======================================== */

        .jobs-content {
          padding-top: 1.4rem;
        }

        /* ========================================
           STATISTICS
        ======================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 0.9rem;

          margin-bottom: 1.5rem;
        }

        .stat-card {
          display: flex;

          align-items: center;

          gap: 0.8rem;

          padding: 0.85rem 1rem;

          border-radius: 12px;

          border: 1px solid;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 7px 17px
            rgba(40, 35, 60, 0.08);
        }

        .total-card {
          background: #f5f2fa;

          border-color: #e2deed;
        }

        .active-card {
          background: #edf8f1;

          border-color: #d5ebdd;
        }

        .stat-icon {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          font-size: 16px;

          font-weight: 800;
        }

        .total-card .stat-icon {
          background: #e5e0f0;

          color: #554e70;
        }

        .active-card .stat-icon {
          background: #d7eddd;

          color: #278653;
        }

        .stat-info {
          display: flex;

          flex-direction: column;

          gap: 0.1rem;
        }

        .stat-info span {
          color: #898794;

          font-size: 10px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.3px;
        }

        .stat-info strong {
          color: #3d3c4d;

          font-size: 18px;
        }

        .active-card .stat-info strong {
          color: #278653;
        }

        /* ========================================
           LIST HEADER
        ======================================== */

        .list-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 1rem;

          margin-bottom: 0.75rem;
        }

        .list-header h2 {
          margin: 0;

          color: #353446;

          font-size: 18px;

          font-weight: 800;
        }

        .list-header > div > span {
          display: block;

          margin-top: 0.2rem;

          color: #92919e;

          font-size: 11px;
        }

        .job-count {
          padding: 0.3rem 0.7rem;

          background: #24233d;

          border-radius: 20px;

          color: #ffffff;

          font-size: 10px;

          font-weight: 700;
        }

        /* ========================================
           JOB LIST
        ======================================== */

        .jobs-list {
          display: flex;

          flex-direction: column;

          gap: 0.7rem;
        }

        /* ========================================
           JOB ITEM
        ======================================== */

        .job-item {
          width: 100%;

          display: flex;

          align-items: center;

          min-height: 70px;

          overflow: hidden;

          background: #ffffff;

          border: 1px solid #dedce6;

          border-radius: 13px;

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .job-item:hover {
          background: #fdf9fb;

          border-color: #e8899f;

          transform: translateY(-2px);

          box-shadow:
            0 8px 20px
            rgba(36, 35, 61, 0.1);
        }

        .job-item:focus {
          outline: 2px solid #ef476f;

          outline-offset: 2px;
        }

        /* ========================================
           DARK SIDE
        ======================================== */

        .job-side {
          width: 66px;

          align-self: stretch;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          transition:
            background 0.2s ease;
        }

        .active-side {
          background: #24233d;
        }

        .closed-side {
          background: #3b394f;
        }

        .job-item:hover .active-side {
          background: #302f4b;
        }

        .job-item:hover .closed-side {
          background: #45435a;
        }

        .job-symbol {
          color: #f4d8e0;

          font-size: 15px;
        }

        .closed-side .job-symbol {
          color: #bcb9c9;
        }

        /* ========================================
           MAIN JOB INFO
        ======================================== */

        .job-main-info {
          flex: 1;

          min-width: 0;

          padding: 0.85rem 1rem;
        }

        .job-title-row {
          display: flex;

          align-items: center;

          gap: 0.65rem;

          flex-wrap: wrap;
        }

        .job-title-row h3 {
          margin: 0;

          color: #393848;

          font-size: clamp(
            15px,
            1.2vw,
            19px
          );

          font-weight: 750;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        /* ========================================
           STATUS
        ======================================== */

        .status-sticker {
          display: inline-flex;

          align-items: center;

          gap: 0.35rem;

          padding: 0.28rem 0.65rem;

          border-radius: 5px;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.4px;

          flex-shrink: 0;

          transform: rotate(-1deg);

          transition:
            transform 0.2s ease;
        }

        .job-item:hover .status-sticker {
          transform: rotate(0deg);
        }

        .active-sticker {
          background: #dff2e5;

          color: #237749;

          border: 1px solid #c8e7d2;
        }

        .closed-sticker {
          background: #e9e7ed;

          color: #686675;

          border: 1px solid #d9d7df;
        }

        .sticker-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        /* ========================================
           META
        ======================================== */

        .job-meta {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 0.9rem;

          margin-top: 0.45rem;

          color: #858592;

          font-size: 11px;
        }

        .job-meta span {
          display: inline-flex;

          align-items: center;

          gap: 0.35rem;
        }

        .meta-icon {
          width: 17px;
          height: 17px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 5px;

          font-style: normal;

          font-size: 9px;

          font-weight: 800;
        }

        .meta-icon.location {
          background: #e9e5f5;

          color: #5c5576;
        }

        .meta-icon.type {
          background: #fbe3e9;

          color: #c63c5d;
        }

        .meta-icon.experience {
          background: #e1f1e8;

          color: #32805a;
        }

        /* ========================================
           DETAILS
        ======================================== */

        .job-details {
          display: flex;

          align-items: center;

          gap: 0.5rem;

          padding-right: 1rem;

          color: #92919e;

          font-size: 10px;

          font-weight: 700;

          transition:
            color 0.2s ease;
        }

        .job-arrow {
          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: #24233d;

          border-radius: 8px;

          color: #ffffff;

          font-size: 16px;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .job-item:hover .job-details {
          color: #ef476f;
        }

        .job-item:hover .job-arrow {
          background: #ef476f;

          transform: translateX(3px);
        }

        /* ========================================
           LOADING
        ======================================== */

        .state-container {
          min-height: 50vh;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          color: #858592;
        }

        .spinner {
          width: 36px;
          height: 36px;

          margin-bottom: 0.8rem;

          border: 4px solid #e9e7f0;

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

        /* ========================================
           ERROR
        ======================================== */

        .error-container {
          display: flex;

          align-items: center;

          gap: 0.9rem;

          margin-top: 1.4rem;

          padding: 0.9rem 1rem;

          background: #fff2f4;

          border: 1px solid #f2c5ce;

          border-radius: 11px;
        }

        .error-icon {
          width: 33px;
          height: 33px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: #ef476f;

          border-radius: 50%;

          color: #ffffff;

          font-size: 14px;

          font-weight: 800;
        }

        .error-container strong {
          color: #6f2e3d;

          font-size: 12px;
        }

        .error-container p {
          margin: 0.15rem 0 0;

          color: #8d3b4d;

          font-size: 11px;
        }

        /* ========================================
           EMPTY
        ======================================== */

        .empty-container {
          min-height: 52vh;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 0.9rem;

          background: #24233d;

          border-radius: 17px;

          color: #f4d8e0;

          font-size: 27px;

          box-shadow:
            0 8px 18px
            rgba(36, 35, 61, 0.16);
        }

        .empty-container h2 {
          margin: 0;

          color: #3b3a4b;

          font-size: 20px;

          font-weight: 800;
        }

        .empty-container p {
          margin: 0.4rem 0 1.1rem;

          color: #888794;

          font-size: 12px;
        }

        .empty-container button {
          display: inline-flex;

          align-items: center;

          gap: 0.4rem;

          padding: 0.7rem 1.1rem;

          border: none;

          border-radius: 9px;

          background: #ef476f;

          color: #ffffff;

          font-family: inherit;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .empty-container button:hover {
          background: #d9365f;

          transform: translateY(-1px);
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 850px) {

          .jobs-page {
            padding: 3% 2.5%;
          }

          .jobs-container {
            padding: 4% 3.5%;
          }

          .jobs-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .add-job-button {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .job-details span {
            display: none;
          }

        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 600px) {

          .jobs-page {
            padding: 0;
          }

          .jobs-container {
            min-height: 92vh;

            padding: 6% 5%;

            border-radius: 0;

            border-left: none;
            border-right: none;
          }

          .header-left {
            align-items: flex-start;
          }

          .header-icon {
            width: 47px;
            height: 47px;

            font-size: 22px;
          }

          .jobs-header h1 {
            font-size: 30px;
          }

          .jobs-header p {
            font-size: 13px;

            line-height: 1.5;
          }

          .stats-grid {
            grid-template-columns: 1fr;

            gap: 0.65rem;
          }

          .list-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 0.5rem;
          }

          .job-item {
            align-items: stretch;
          }

          .job-side {
            width: 52px;
          }

          .job-main-info {
            padding: 0.75rem;
          }

          .job-title-row h3 {
            font-size: 14px;
          }

          .job-meta {
            flex-direction: column;

            align-items: flex-start;

            gap: 0.3rem;

            font-size: 10px;
          }

          .job-details {
            align-items: center;

            padding-right: 0.7rem;
          }

          .job-arrow {
            width: 27px;
            height: 27px;
          }

        }

        /* ========================================
           SMALL MOBILE
        ======================================== */

        @media (max-width: 420px) {

          .jobs-container {
            padding: 7% 5%;
          }

          .header-left {
            gap: 0.7rem;
          }

          .header-icon {
            width: 43px;
            height: 43px;
          }

          .jobs-header h1 {
            font-size: 27px;
          }

          .job-side {
            width: 45px;
          }

          .job-symbol {
            font-size: 12px;
          }

        }

      `}</style>
    </CompanyLayout>
  );
}

