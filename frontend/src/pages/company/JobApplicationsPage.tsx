import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { jobApplicationsApi } from '../../api_services/applications/JobApplicationsApiService';
import { quizApi } from '../../api_services/quiz/QuizApiService';

import CompanyLayout from '../../components/company/CompanyLayout';

import {
  ApplicationStatus,
  type ApplicationStatus as ApplicationStatusValue,
} from '../../models/applications/ApplicationStatus';

import type { JobApplication } from '../../models/applications/JobApplication';
import type { QuizAnswer } from '../../models/quiz/QuizAnswer';

export default function JobApplicationsPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  const [answers, setAnswers] =
    useState<Record<string, QuizAnswer[]>>({});

  const [openAnswersId, setOpenAnswersId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ========================================
  // LOAD APPLICATIONS
  // ========================================

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await jobApplicationsApi.getApplicationsForJob(jobId);

        setApplications(data);
      } catch {
        setError('Prijave nisu dostupne.');
      } finally {
        setLoading(false);
      }
    };

    void loadApplications();
  }, [jobId]);

  // ========================================
  // CHANGE APPLICATION STATUS
  // ========================================

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatusValue
  ) => {
    try {
      setError('');

      const updated =
        await jobApplicationsApi.updateApplicationStatus(
          applicationId,
          { status }
        );

      setApplications((previous) =>
        previous.map((application) =>
          application.id === updated.id
            ? updated
            : application
        )
      );
    } catch {
      setError(
        'Status prijave nije moguće promeniti.'
      );
    }
  };

  // ========================================
  // SHOW / HIDE ANSWERS
  // ========================================

  const toggleAnswers = async (
    applicationId: string
  ) => {
    if (openAnswersId === applicationId) {
      setOpenAnswersId(null);
      return;
    }

    try {
      setError('');

      if (!answers[applicationId]) {
        const data =
          await quizApi.getApplicationAnswers(
            applicationId
          );

        setAnswers((previous) => ({
          ...previous,
          [applicationId]: data,
        }));
      }

      setOpenAnswersId(applicationId);
    } catch {
      setError(
        'Odgovori kandidata nisu dostupni.'
      );
    }
  };

  // ========================================
  // STATISTICS
  // ========================================

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status ===
        ApplicationStatus.Pending
    ).length;

  const acceptedApplications =
    applications.filter(
      (application) =>
        application.status ===
        ApplicationStatus.Accepted
    ).length;

  return (
    <CompanyLayout>
      <div className="applications-page">

        <div className="applications-container">

          {/* ========================================
              BACK BUTTON
          ======================================== */}

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(`/my-jobs/${jobId}`)
            }
          >
            <span>←</span>
            Nazad
          </button>

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="applications-header">

            <div className="header-left">

              <div className="header-icon">
                <span>▤</span>
              </div>

              <div>

                <div className="title-row">

                  <h1>
                    Job Applications
                  </h1>

                  {!loading &&
                    !error &&
                    applications.length > 0 && (
                      <span className="total-badge">
                        {applications.length}
                      </span>
                    )}

                </div>

                <p>
                  Pregled prijava kandidata za vaš oglas.
                </p>

              </div>

            </div>

          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading && (
            <div className="state-container">

              <div className="spinner" />

              <p>
                Učitavanje prijava...
              </p>

            </div>
          )}

          {/* ========================================
              ERROR
          ======================================== */}

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

          {/* ========================================
              EMPTY
          ======================================== */}

          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="empty-container">

                <div className="empty-icon">
                  <span>♢</span>
                </div>

                <h2>
                  Još nema prijava
                </h2>

                <p>
                  Za ovaj oglas još nije stigla
                  nijedna prijava kandidata.
                </p>

                <button
                  type="button"
                  className="empty-button"
                  onClick={() =>
                    navigate(`/my-jobs/${jobId}`)
                  }
                >
                  <span>←</span>
                  Nazad na detalje oglasa
                </button>

              </div>
            )}

          {/* ========================================
              APPLICATIONS
          ======================================== */}

          {!loading &&
            !error &&
            applications.length > 0 && (

              <div className="applications-content">

                {/* ========================================
                    STATISTICS
                ======================================== */}

                <div className="stats-grid">

                  <div className="stat-card total-card">

                    <div className="stat-icon">
                      <span>▤</span>
                    </div>

                    <div className="stat-info">

                      <span>
                        Ukupno prijava
                      </span>

                      <strong>
                        {applications.length}
                      </strong>

                    </div>

                  </div>

                  <div className="stat-card pending-card">

                    <div className="stat-icon">
                      <span>◷</span>
                    </div>

                    <div className="stat-info">

                      <span>
                        Na čekanju
                      </span>

                      <strong>
                        {pendingApplications}
                      </strong>

                    </div>

                  </div>

                  <div className="stat-card accepted-card">

                    <div className="stat-icon">
                      <span>✓</span>
                    </div>

                    <div className="stat-info">

                      <span>
                        Prihvaćene
                      </span>

                      <strong>
                        {acceptedApplications}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* ========================================
                    LIST HEADER
                ======================================== */}

                <div className="list-header">

                  <div>

                    <h2>
                      Prijave kandidata
                    </h2>

                    <span>
                      Pregledajte informacije i odgovore kandidata.
                    </span>

                  </div>

                  <span className="application-count">
                    {applications.length} prijava
                  </span>

                </div>

                {/* ========================================
                    APPLICATION LIST
                ======================================== */}

                <div className="applications-list">

                  {applications.map((application) => {

                    const isAccepted =
                      application.status ===
                      ApplicationStatus.Accepted;

                    const isRejected =
                      application.status ===
                      ApplicationStatus.Rejected;

                    return (
                      <article
                        key={application.id}
                        className="application-item"
                      >

                        {/* ========================================
                            SIDE
                        ======================================== */}

                        <div
                          className={
                            isAccepted
                              ? 'application-side accepted-side'
                              : isRejected
                              ? 'application-side rejected-side'
                              : 'application-side pending-side'
                          }
                        >

                          <span className="application-symbol">

                            {isAccepted
                              ? '✓'
                              : isRejected
                              ? '×'
                              : '◷'}

                          </span>

                        </div>

                        {/* ========================================
                            MAIN INFO
                        ======================================== */}

                        <div className="application-main">

                          <div className="application-top">

                            <div className="candidate-info">

                              <div className="candidate-avatar">
                                <span>
                                  ♙
                                </span>
                              </div>

                              <div>

                                <div className="candidate-title-row">

                                  <h3>
                                    Kandidat
                                  </h3>

                                  <span
                                    className={
                                      isAccepted
                                        ? 'status-sticker accepted-sticker'
                                        : isRejected
                                        ? 'status-sticker rejected-sticker'
                                        : 'status-sticker pending-sticker'
                                    }
                                  >

                                    <span className="sticker-dot" />

                                    {isAccepted
                                      ? 'PRIHVAĆENA'
                                      : isRejected
                                      ? 'ODBIJENA'
                                      : 'NA ČEKANJU'}

                                  </span>

                                </div>

                                <span className="candidate-id">
                                  ID: {application.candidateProfileId}
                                </span>

                              </div>

                            </div>

                            <div className="application-date">

                              <span>
                                Datum prijave
                              </span>

                              <strong>
                                {new Date(
                                  application.appliedAt
                                ).toLocaleString('sr-RS')}
                              </strong>

                            </div>

                          </div>

                          {/* ========================================
                              COVER LETTER
                          ======================================== */}

                          <div className="cover-letter">

                            <div className="section-label">

                              <span className="label-icon">
                                ✎
                              </span>

                              Motivaciono pismo

                            </div>

                            <p>
                              {application.coverLetter ||
                                'Kandidat nije uneo motivaciono pismo.'}
                            </p>

                          </div>

                          {/* ========================================
                              ACTIONS
                          ======================================== */}

                          <div className="application-actions">

                            <div className="status-control">

                              <label
                                htmlFor={`status-${application.id}`}
                              >
                                Status prijave
                              </label>

                              <select
                                id={`status-${application.id}`}
                                value={application.status}
                                onChange={(event) =>
                                  void handleStatusChange(
                                    application.id,
                                    event.target
                                      .value as ApplicationStatusValue
                                  )
                                }
                              >

                                {Object.values(
                                  ApplicationStatus
                                ).map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                ))}

                              </select>

                            </div>

                            <button
                              type="button"
                              className="answers-button"
                              onClick={() =>
                                void toggleAnswers(
                                  application.id
                                )
                              }
                            >

                              <span>
                                {openAnswersId ===
                                application.id
                                  ? '−'
                                  : '＋'}
                              </span>

                              {openAnswersId ===
                              application.id
                                ? 'Sakrij odgovore'
                                : 'Prikaži odgovore'}

                            </button>

                          </div>

                          {/* ========================================
                              ANSWERS
                          ======================================== */}

                          {openAnswersId ===
                            application.id && (
                            <div className="answers-container">

                              <div className="answers-header">

                                <div>

                                  <h4>
                                    Odgovori na pitanja
                                  </h4>

                                  <span>
                                    Odgovori kandidata na pitanja oglasa.
                                  </span>

                                </div>

                                <span className="answers-count">
                                  {answers[
                                    application.id
                                  ]?.length ?? 0}
                                </span>

                              </div>

                              {answers[
                                application.id
                              ]?.length ? (
                                <div className="answers-list">

                                  {answers[
                                    application.id
                                  ].map(
                                    (
                                      answer,
                                      index
                                    ) => (
                                      <div
                                        key={
                                          answer.id ??
                                          index
                                        }
                                        className="answer-item"
                                      >

                                        <div className="answer-number">
                                          {index + 1}
                                        </div>

                                        <div className="answer-content">

                                          <span>
                                            Pitanje {index + 1}
                                          </span>

                                          <p>
                                            {answer.answerText}
                                          </p>

                                        </div>

                                      </div>
                                    )
                                  )}

                                </div>
                              ) : (
                                <div className="no-answers">
                                  Kandidat nije odgovorio
                                  na pitanja.
                                </div>
                              )}

                            </div>
                          )}

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

        /* ========================================
           GENERAL
        ======================================== */

        * {
          box-sizing: border-box;
        }

        .applications-page {
          width: 100%;
          min-height: 92vh;
          padding: 1.5% 0 3%;
          background: #19182d;
        }

        .applications-container {
          width: 88%;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* ========================================
           BACK BUTTON
        ======================================== */

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

        /* ========================================
           HEADER
        ======================================== */

        .applications-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 1.8rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background: #ef476f;

          color: #ffffff;

          font-size: 24px;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .title-row h1 {
          margin: 0;

          color: #ffffff;

          font-size: clamp(24px, 2.2vw, 32px);
          font-weight: 750;
        }

        .title-row .total-badge {
          min-width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 0.5rem;

          border-radius: 50%;

          background: #fce8ee;

          color: #c8385c;

          font-size: 12px;
          font-weight: 800;
        }

        .applications-header p {
          margin: 0.3rem 0 0;

          color: #9998a8;

          font-size: 14px;
        }

        /* ========================================
           STATE
        ======================================== */

        .state-container {
          min-height: 300px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 1rem;

          color: #9998a8;
        }

        .spinner {
          width: 34px;
          height: 34px;

          border: 3px solid #35344d;
          border-top-color: #ef476f;

          border-radius: 50%;

          animation: spin 0.8s linear infinite;
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
          gap: 1rem;

          padding: 1rem 1.2rem;

          border: 1px solid #f2ccd8;
          border-radius: 10px;

          background: #fff3f6;

          color: #c8385c;
        }

        .error-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: #ef476f;

          color: #ffffff;

          font-weight: 800;
        }

        .error-container strong {
          font-size: 14px;
        }

        .error-container p {
          margin: 0.2rem 0 0;

          font-size: 13px;
        }

        /* ========================================
           EMPTY
        ======================================== */

        .empty-container {
          min-height: 380px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 3rem 1rem;

          text-align: center;
        }

        .empty-icon {
          width: 70px;
          height: 70px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 1.2rem;

          border-radius: 18px;

          background: #24233d;

          color: #ef476f;

          font-size: 30px;
        }

        .empty-container h2 {
          margin: 0;

          color: #ffffff;

          font-size: 22px;
        }

        .empty-container p {
          max-width: 430px;

          margin: 0.6rem 0 1.4rem;

          color: #9998a8;

          font-size: 14px;
          line-height: 1.5;
        }

        .empty-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          padding: 0.65rem 1rem;

          border: 1px solid #3b3a53;
          border-radius: 9px;

          background: #24233d;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .empty-button span {
          color: #ef476f;

          font-size: 18px;
        }

        .empty-button:hover {
          background: #302f4c;
          border-color: #ef476f;
        }

        /* ========================================
           STATISTICS
        ======================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 1rem;

          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;

          gap: 0.9rem;

          padding: 1.1rem;

          border: 1px solid #34334c;
          border-radius: 13px;

          background: #222139;
        }

        .stat-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          background: #2d2c47;

          color: #ef476f;

          font-size: 20px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;

          gap: 0.2rem;
        }

        .stat-info span {
          color: #9998a8;

          font-size: 12px;
          font-weight: 600;
        }

        .stat-info strong {
          color: #ffffff;

          font-size: 22px;
          font-weight: 750;
        }

        /* ========================================
           LIST HEADER
        ======================================== */

        .list-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          margin-bottom: 1rem;
        }

        .list-header h2 {
          margin: 0;

          color: #ffffff;

          font-size: 20px;
          font-weight: 700;
        }

        .list-header span {
          display: block;

          margin-top: 0.3rem;

          color: #8f8ea0;

          font-size: 12px;
        }

        .list-header .application-count {
          margin: 0;

          padding: 0.45rem 0.7rem;

          border-radius: 7px;

          background: #292844;

          color: #c2c1cc;

          font-size: 12px;
          font-weight: 700;
        }

        /* ========================================
           APPLICATION LIST
        ======================================== */

        .applications-list {
          display: flex;
          flex-direction: column;

          gap: 0.8rem;
        }

        .application-item {
          display: flex;

          overflow: hidden;

          border: 1px solid #dedde8;
          border-radius: 12px;

          background: #ffffff;

          box-shadow:
            0 4px 12px
            rgba(0, 0, 0, 0.08);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .application-item:hover {
          transform: translateY(-1px);

          box-shadow:
            0 7px 18px
            rgba(0, 0, 0, 0.1);
        }

        /* ========================================
           APPLICATION SIDE
        ======================================== */

        .application-side {
          width: 6px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .accepted-side {
          background: #39b87f;
        }

        .rejected-side {
          background: #ef476f;
        }

        .pending-side {
          background: #e4a93b;
        }

        .application-symbol {
          display: none;
        }

        /* ========================================
           APPLICATION MAIN
        ======================================== */

        .application-main {
          flex: 1;

          min-width: 0;

          padding: 1.2rem 1.3rem;
        }

        .application-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 1rem;
        }

        .candidate-info {
          display: flex;
          align-items: center;

          gap: 0.8rem;
        }

        .candidate-avatar {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: #24233d;

          color: #ffffff;

          font-size: 19px;
        }

        .candidate-title-row {
          display: flex;
          align-items: center;

          gap: 0.6rem;
        }

        .candidate-title-row h3 {
          margin: 0;

          color: #282738;

          font-size: 15px;
          font-weight: 750;
        }

        .candidate-id {
          display: block;

          margin-top: 0.25rem;

          color: #92919e;

          font-size: 11px;
        }

        /* ========================================
           STATUS STICKER
        ======================================== */

        .status-sticker {
          display: inline-flex;
          align-items: center;

          gap: 0.3rem;

          padding: 0.25rem 0.45rem;

          border-radius: 5px;

          font-size: 9px;
          font-weight: 800;
        }

        .sticker-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: currentColor;
        }

        .accepted-sticker {
          background: #e7f8ef;
          color: #25885d;
        }

        .rejected-sticker {
          background: #fff0f4;
          color: #c8385c;
        }

        .pending-sticker {
          background: #fff6df;
          color: #b27a15;
        }

        /* ========================================
           DATE
        ======================================== */

        .application-date {
          display: flex;
          flex-direction: column;

          align-items: flex-end;

          gap: 0.25rem;
        }

        .application-date span {
          color: #9998a8;

          font-size: 10px;
          font-weight: 600;
        }

        .application-date strong {
          color: #4a4958;

          font-size: 11px;
          font-weight: 700;
        }

        /* ========================================
           COVER LETTER
        ======================================== */

        .cover-letter {
          margin-top: 1.1rem;
          padding: 0.9rem 1rem;

          border-radius: 9px;

          background: #f7f7fa;
        }

        .section-label {
          display: flex;
          align-items: center;

          gap: 0.4rem;

          margin-bottom: 0.4rem;

          color: #555463;

          font-size: 11px;
          font-weight: 750;
        }

        .label-icon {
          color: #ef476f;

          font-size: 14px;
        }

        .cover-letter p {
          margin: 0;

          color: #555463;

          font-size: 13px;
          line-height: 1.55;
        }

        /* ========================================
           ACTIONS
        ======================================== */

        .application-actions {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 1rem;

          margin-top: 1rem;
        }

        .status-control {
          display: flex;
          flex-direction: column;

          gap: 0.35rem;
        }

        .status-control label {
          color: #777685;

          font-size: 11px;
          font-weight: 700;
        }

        .status-control select {
          min-width: 150px;

          padding: 0.55rem 0.7rem;

          border: 1px solid #d9d8e2;
          border-radius: 7px;

          background: #ffffff;

          color: #444351;

          font-family: inherit;

          font-size: 12px;

          outline: none;

          cursor: pointer;
        }

        .status-control select:focus {
          border-color: #ef476f;
        }

        .answers-button {
          display: flex;
          align-items: center;

          gap: 0.4rem;

          padding: 0.6rem 0.8rem;

          border: 1px solid #dedde8;
          border-radius: 7px;

          background: #ffffff;

          color: #555463;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .answers-button span {
          color: #ef476f;

          font-size: 15px;
          font-weight: 800;
        }

        .answers-button:hover {
          border-color: #ef476f;

          background: #fff3f6;

          color: #c8385c;
        }

        /* ========================================
           ANSWERS
        ======================================== */

        .answers-container {
          margin-top: 1rem;

          padding: 1rem;

          border: 1px solid #e2e1e9;
          border-radius: 10px;

          background: #fafafd;
        }

        .answers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 0.8rem;
        }

        .answers-header h4 {
          margin: 0;

          color: #383744;

          font-size: 13px;
          font-weight: 750;
        }

        .answers-header span {
          display: block;

          margin-top: 0.2rem;

          color: #92919e;

          font-size: 10px;
        }

        .answers-count {
          min-width: 25px;
          height: 25px;

          display: flex !important;
          align-items: center;
          justify-content: center;

          margin: 0 !important;

          border-radius: 50%;

          background: #fce8ee;

          color: #c8385c !important;

          font-size: 10px !important;
          font-weight: 800;
        }

        .answers-list {
          display: flex;
          flex-direction: column;

          gap: 0.6rem;
        }

        .answer-item {
          display: flex;

          gap: 0.7rem;

          padding: 0.75rem;

          border: 1px solid #e4e3ea;
          border-radius: 8px;

          background: #ffffff;
        }

        .answer-number {
          width: 27px;
          height: 27px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          background: #24233d;

          color: #ffffff;

          font-size: 10px;
          font-weight: 800;
        }

        .answer-content {
          min-width: 0;
        }

        .answer-content span {
          display: block;

          margin-bottom: 0.2rem;

          color: #92919e;

          font-size: 9px;
          font-weight: 700;
        }

        .answer-content p {
          margin: 0;

          color: #444351;

          font-size: 12px;
          line-height: 1.45;

          word-break: break-word;
        }

        .no-answers {
          padding: 1rem;

          border-radius: 7px;

          background: #ffffff;

          color: #92919e;

          text-align: center;

          font-size: 12px;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 900px) {

          .applications-container {
            width: 80%;
          }

          .stats-grid {
            grid-template-columns:
              1fr;
          }

          .application-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .application-date {
            align-items: flex-start;
          }

        }

        @media (max-width: 600px) {

          .applications-container {
            width: 90%;
          }

          .applications-page {
            padding-top: 3%;
          }

          .header-left {
            align-items: flex-start;
          }

          .header-icon {
            width: 44px;
            height: 44px;

            font-size: 20px;
          }

          .application-main {
            padding: 1rem;
          }

          .candidate-title-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.35rem;
          }

          .application-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .status-control select {
            width: 100%;
          }

          .answers-button {
            width: 100%;

            justify-content: center;
          }

          .list-header {
            align-items: flex-start;
            flex-direction: column;

            gap: 0.6rem;
          }

        }

      `}</style>
    </CompanyLayout>
  );
}