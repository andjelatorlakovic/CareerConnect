import { useState, type FormEvent } from 'react';

import type { AddEducationRequest } from '../../types/candidate/AddEducationRequest';

interface EducationFormProps {
  loading: boolean;

  onSubmit: (
    request: AddEducationRequest
  ) => Promise<boolean>;
}

const initialForm: AddEducationRequest = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
};

export default function EducationForm({
  loading,
  onSubmit,
}: EducationFormProps) {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSubmit({
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      fieldOfStudy: form.fieldOfStudy.trim(),
      startDate: `${form.startDate}T00:00:00`,
      endDate: `${form.endDate}T00:00:00`,
    });

    if (success) {
      setForm(initialForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-0 border-t border-solid border-[#e5e2ec] pt-5"
    >
      <h3 className="m-0 mb-4 text-base font-bold text-[#333344]">
        Dodaj obrazovanje
      </h3>

      <fieldset
        disabled={loading}
        className="m-0 grid min-w-0 gap-5 border-0 p-0"
      >
        <label className="grid gap-2 text-sm font-semibold">
          Obrazovna ustanova

          <input
            required
            value={form.institution}
            onChange={(event) => {
              setForm({ ...form, institution: event.target.value });
            }}
            className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Stepen obrazovanja

            <input
              required
              value={form.degree}
              onChange={(event) => {
                setForm({ ...form, degree: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Oblast studija

            <input
              required
              value={form.fieldOfStudy}
              onChange={(event) => {
                setForm({ ...form, fieldOfStudy: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Datum početka

            <input
              type="date"
              required
              value={form.startDate}
              max={form.endDate || undefined}
              onChange={(event) => {
                setForm({ ...form, startDate: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Datum završetka

            <input
              type="date"
              required
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(event) => {
                setForm({ ...form, endDate: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-fit cursor-pointer rounded-lg border-0 bg-[#ef476f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#df3d65] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Čuvanje...' : '+ Dodaj obrazovanje'}
        </button>
      </fieldset>
    </form>
  );
}