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
    <div className="question-page !min-h-0 !bg-transparent !p-0">
      <div className="question-card !mx-auto !w-full !max-w-3xl !rounded-[28px] !border !border-solid !border-[#e3dfe8] !bg-[#f7f7fb] !p-4 !shadow-xl sm:!p-8">

        <button
          type="button"
          className="back-button !mb-5 !inline-flex !items-center !gap-2 !border-0 !bg-transparent !p-0 !font-semibold !text-[#c8385c] hover:!underline"
          onClick={() => {
            if (jobId) {
              navigate(`/my-jobs/${jobId}`);
            }
          }}
        >
          <span>←</span>
          Nazad
        </button>

        <div className="question-header !rounded-3xl !border-0 !bg-[#24233d] !p-6 sm:!p-8">
          <h1>Dodavanje pitanja</h1>

          <p>
            Dodajte pitanje koje će kandidatima pomoći
            da bolje razumeju poziciju.
          </p>
        </div>

        <form
          className="question-form !mt-6 !grid !gap-4"
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
            className="question-submit-button !justify-self-start !rounded-xl !border-0 !bg-[#ef476f] !px-5 !py-3 !font-bold !text-white hover:!bg-[#d9365f] disabled:!opacity-60"
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
      </div>    </div>
  );
}
