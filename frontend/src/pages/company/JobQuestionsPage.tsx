import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { quizApi } from '../../api_services/quiz/QuizApiService';
import CompanyLayout from '../../components/company/CompanyLayout';
import QuestionForm from '../../components/company/QuestionForm';

import type { JobListingQuestion } from '../../models/quiz/JobListingQuestion';

export default function JobQuestionsPage() {
  const { id: jobId } = useParams<{ id: string }>();

  const [questions, setQuestions] =
    useState<JobListingQuestion[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadQuestions = async () => {
    if (!jobId) {
      return;
    }

    try {
      setError('');

      const result =
        await quizApi.getJobQuestions(jobId);

      setQuestions(result);
    } catch (error) {
      console.error(
        'GET QUESTIONS ERROR:',
        error
      );

      setError('Pitanja nisu dostupna.');
    }
  };

  useEffect(() => {
    void loadQuestions();
  }, [jobId]);

  const handleAdd = async (
    questionText: string
  ) => {
    if (!jobId) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      await quizApi.addQuestion(jobId, {
        questionText,
        orderIndex: questions.length + 1,
      });

      await loadQuestions();
    } catch (error) {
      console.error(
        'ADD QUESTION ERROR:',
        error
      );

      setError(
        'Pitanje nije moguće dodati.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    questionId: string
  ) => {
    if (
      !jobId ||
      !window.confirm('Obrisati pitanje?')
    ) {
      return;
    }

    try {
      setError('');

      await quizApi.deleteQuestion(
        jobId,
        questionId
      );

      await loadQuestions();
    } catch (error) {
      console.error(
        'DELETE QUESTION ERROR:',
        error
      );

      setError(
        'Pitanje nije moguće obrisati.'
      );
    }
  };

  return (
    <CompanyLayout>
      <div className="questions-page">
        <div className="questions-content">

          <QuestionForm
            loading={loading}
            onSubmit={(text) =>
              void handleAdd(text)
            }
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {questions.length > 0 && (
            <div className="questions-list">

              <div className="questions-list-header">
                <h2>Pitanja</h2>

                <span>
                  {questions.length}
                </span>
              </div>

              {questions.map((question) => (
                <article
                  key={question.id}
                  className="question-item"
                >
                  <div className="question-number">
                    {question.orderIndex}
                  </div>

                  <div className="question-content">
                    <span>
                      Pitanje {question.orderIndex}
                    </span>

                    <p>
                      {question.questionText}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      void handleDelete(
                        question.id
                      )
                    }
                  >
                    Obriši
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .questions-page {
          width: 100%;
          min-height: 92vh;
          padding: 1% 0;
          background: #19182d;
        }

        .questions-content {
          width: 100%;
          margin-top: 0;
        }

        .error-message {
          width: 68%;
          margin: 0.8rem auto 0;
          padding: 0.8rem 1rem;
          background: #fff3f6;
          border: 1px solid #f2ccd8;
          border-radius: 9px;
          color: #c8385c;
          font-size: 14px;
          font-weight: 600;
        }

        .questions-list {
          width: 68%;
          margin: 0.8rem auto 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .questions-list-header {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.2rem;
        }

        .questions-list-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(20px, 1.8vw, 26px);
          font-weight: 700;
        }

        .questions-list-header span {
          min-width: 28px;
          height: 28px;
          padding: 0 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fce8ee;
          border-radius: 50%;
          color: #c8385c;
          font-size: 12px;
          font-weight: 800;
        }

        .question-item {
          width: 100%;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
          border: 1px solid #dedde8;
          border-radius: 12px;
          box-shadow:
            0 4px 12px
            rgba(0, 0, 0, 0.08);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .question-item:hover {
          background: #fafafd;
          transform: translateY(-1px);
          box-shadow:
            0 7px 18px
            rgba(0, 0, 0, 0.1);
        }

        .question-number {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #24233d;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
        }

        .question-content {
          flex: 1;
          min-width: 0;
        }

        .question-content span {
          display: block;
          margin-bottom: 0.25rem;
          color: #92919e;
          font-size: 11px;
          font-weight: 700;
        }

        .question-content p {
          margin: 0;
          color: #333344;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }

        .delete-button {
          flex-shrink: 0;
          padding: 0.55rem 0.85rem;
          border: 1px solid #f0c4d0;
          border-radius: 8px;
          background: #fff3f6;
          color: #c8385c;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .delete-button:hover {
          background: #ef476f;
          border-color: #ef476f;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .questions-list,
          .error-message {
            width: 80%;
          }
        }

        @media (max-width: 600px) {
          .questions-list,
          .error-message {
            width: 90%;
          }

          .question-item {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .question-content {
            width: calc(100% - 51px);
          }

          .delete-button {
            width: 100%;
          }
        }
      `}</style>
    </CompanyLayout>
  );
}
