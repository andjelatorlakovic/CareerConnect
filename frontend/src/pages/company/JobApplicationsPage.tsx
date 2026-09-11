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
      <div className="applications-page !min-h-0 !bg-transparent !p-0">

        <div className="applications-container !min-h-[86vh] !rounded-[28px] !border !border-solid !border-[#e3dfe8] !bg-[#f7f7fb] !p-4 !shadow-xl sm:!p-8">

          {/* ========================================
              BACK BUTTON
          ======================================== */}

          <button
            type="button"
            className="back-button !mb-5 !inline-flex !items-center !gap-2 !border-0 !bg-transparent !p-0 !font-semibold !text-[#c8385c] hover:!underline"
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

          <div className="applications-header !rounded-3xl !bg-[#24233d] !p-6 sm:!p-8">

            <div className="header-left !flex !items-center !gap-4">

              <div className="header-icon !grid !size-12 !place-items-center !rounded-2xl !bg-[#ef476f] !text-xl !text-white">
                <span>▤</span>
              </div>

              <div>

                <div className="title-row !flex !flex-wrap !items-center !gap-3">

                  <h1 className="!m-0 !text-3xl !font-bold !tracking-tight !text-white sm:!text-4xl">
                    Job Applications
                  </h1>

                  {!loading &&
                    !error &&
                    applications.length > 0 && (
                      <span className="total-badge !rounded-full !bg-[#ef476f] !px-3 !py-1 !text-sm !font-bold !text-white">
                        {applications.length}
                      </span>
                    )}

                </div>

                <p className="!mb-0 !mt-2 !text-base !text-[#d3d1e0]">
                  Pregled prijava kandidata za vaš oglas.
                </p>

              </div>

            </div>

          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading && (
            <div className="state-container !grid !min-h-72 !place-items-center !gap-3 !text-[#666576]">

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

          {/* ========================================
              EMPTY
          ======================================== */}

          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="empty-container !mx-auto !mt-10 !grid !max-w-xl !justify-items-center !gap-3 !rounded-2xl !border !border-dashed !border-[#d9d9e2] !bg-white !p-10 !text-center">

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
                  className="empty-button !mt-2 !inline-flex !items-center !gap-2 !rounded-xl !border-0 !bg-[#ef476f] !px-5 !py-3 !font-bold !text-white hover:!bg-[#d9365f]"
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

                <div className="stats-grid !grid !grid-cols-1 !gap-4 sm:!grid-cols-2 lg:!grid-cols-3">

                  <div className="stat-card total-card !flex !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5 !shadow-sm">

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

                  <div className="stat-card pending-card !flex !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5 !shadow-sm">

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

                  <div className="stat-card accepted-card !flex !items-center !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5 !shadow-sm">

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

                <div className="list-header !mt-8 !flex !flex-wrap !items-center !justify-between !gap-4 !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !p-5">

                  <div>

                    <h2>
                      Prijave kandidata
                    </h2>

                    <span>
                      Pregledajte informacije i odgovore kandidata.
                    </span>

                  </div>

                  <span className="application-count !rounded-full !bg-[#fce8ee] !px-3 !py-1 !text-sm !font-bold !text-[#c8385c]">
                    {applications.length} prijava
                  </span>

                </div>

                {/* ========================================
                    APPLICATION LIST
                ======================================== */}

                <div className="applications-list !mt-4 !grid !gap-4">

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
                        className="application-item !flex !overflow-hidden !rounded-2xl !border !border-solid !border-[#e6e2eb] !bg-white !shadow-sm"
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

                        <div className="application-main !min-w-0 !flex-1 !p-5">

                          <div className="application-top !flex !flex-wrap !items-start !justify-between !gap-4">

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

                          <div className="cover-letter !mt-5 !rounded-xl !bg-[#f8f8fc] !p-4">

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

                          <div className="application-actions !mt-5 !flex !flex-wrap !items-end !justify-between !gap-4">

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
                              className="answers-button !inline-flex !items-center !gap-2 !rounded-xl !border !border-solid !border-[#ef476f] !bg-white !px-4 !py-3 !font-semibold !text-[#c8385c] hover:!bg-[#fff1f4]"
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
                            <div className="answers-container !mt-5 !rounded-2xl !border !border-solid !border-[#f1c8d3] !bg-[#fff7f9] !p-5">

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
                                          `${answer.jobListingQuestionId}-${index}`
                                        }
                                        className="answer-item !flex !gap-3 !rounded-xl !bg-white !p-4"
                                      >

                                        <div className="answer-number">
                                          {index + 1}
                                        </div>

                                        <div className="answer-content">

                                          <span>
                                            Pitanje {index + 1}
                                          </span>

                                          <small>
                                            ID pitanja: {answer.jobListingQuestionId}
                                          </small>

                                          <p>
                                            {answer.answer}
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
    </CompanyLayout>
  );
}
