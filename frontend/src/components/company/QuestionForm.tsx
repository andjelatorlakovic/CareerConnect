import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface QuestionFormProps {
  loading: boolean;
  onSubmit: (questionText: string) => void;
}

export default function QuestionForm({
  loading,
  onSubmit,
}: QuestionFormProps) {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();

  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!questionText.trim()) {
      return;
    }

    onSubmit(questionText.trim());
    setQuestionText('');
  };

  return (
    <div className="question-page">
      <div className="question-card">

        <button
          type="button"
          className="back-button"
          onClick={() => {
            if (jobId) {
              navigate(`/my-jobs/${jobId}`);
            }
          }}
        >
          <span>←</span>
          Nazad
        </button>

        <div className="question-header">
          <h1>Dodavanje pitanja</h1>

          <p>
            Dodajte pitanje koje će kandidatima pomoći
            da bolje razumeju poziciju.
          </p>
        </div>

        <form
          className="question-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="question">
              Pitanje
            </label>

            <textarea
              id="question"
              value={questionText}
              onChange={(event) =>
                setQuestionText(event.target.value)
              }
              placeholder="Unesite pitanje..."
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="question-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Dodavanje...
              </>
            ) : (
              <>
                <span className="plus-icon">+</span>
                Dodaj pitanje
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .question-page {
          width: 100%;
          padding: 1% 3%;
          background: #19182d;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .question-card {
          width: 96%;
          background: #ffffff;
          border-radius: 18px;
          padding: 1.5% 3.5% 3.5%;
          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.12);
        }

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
          transition: transform 0.2s ease;
        }

        .back-button:hover {
          color: #ef476f;
        }

        .back-button:hover span {
          transform: translateX(-4px);
        }

        .question-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .question-header h1 {
          margin: 0;
          color: #ef476f;
          font-size: clamp(30px, 3vw, 44px);
          font-weight: 700;
          letter-spacing: -1.5px;
        }

        .question-header p {
          margin: 0.7% 0 0;
          color: #8c8c9a;
          font-size: clamp(14px, 1.2vw, 17px);
        }

        .question-form {
          width: 68%;
          margin: 0 auto;
          padding: 2rem;
          background: #fafafd;
          border: 1px solid #e5e3ec;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 1.3vw;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field label {
          color: #333344;
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 600;
        }

        .form-field textarea {
          width: 100%;
          min-height: 130px;
          padding: 0.8rem 0.9rem;
          border: 1px solid #d9d9e2;
          border-radius: 9px;
          background: #ffffff;
          color: #333344;
          font-family: inherit;
          font-size: clamp(14px, 1vw, 16px);
          line-height: 1.5;
          resize: vertical;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .form-field textarea::placeholder {
          color: #aaa9b5;
        }

        .form-field textarea:focus {
          border-color: #ef476f;
          box-shadow:
            0 0 0 3px
            rgba(239, 71, 111, 0.1);
        }

        .question-submit-button {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 9px;
          background: #ef476f;
          color: #ffffff;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .question-submit-button:hover:not(:disabled) {
          background: #d9365f;
          transform: translateY(-1px);
          box-shadow:
            0 5px 14px
            rgba(239, 71, 111, 0.25);
        }

        .question-submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .plus-icon {
          font-size: 20px;
          line-height: 1;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .question-card {
            width: 96%;
          }

          .question-form {
            width: 80%;
          }
        }

        @media (max-width: 600px) {
          .question-page {
            padding: 3% 2%;
          }

          .question-card {
            width: 100%;
            padding: 4% 5% 6%;
          }

          .question-form {
            width: 90%;
            padding: 1.2rem;
          }

          .question-header {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

