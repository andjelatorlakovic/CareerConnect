import { useState, type FormEvent } from 'react';

import type { User } from '../../models/users/User';
import type { UpdateUserRequest } from '../../types/users/UpdateUserRequest';

interface AccountFormProps {
  initial: User;
  loading: boolean;

  onSubmit: (
    request: UpdateUserRequest
  ) => Promise<void>;
}

export default function AccountForm({
  initial,
  loading,
  onSubmit,
}: AccountFormProps) {
  const [form, setForm] = useState<UpdateUserRequest>({
    firstName: initial.firstName,
    lastName: initial.lastName,
    email: initial.email,
  });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        disabled={loading}
        className="m-0 grid min-w-0 gap-5 border-0 p-0"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Ime

            <input
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => {
                setForm({ ...form, firstName: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Prezime

            <input
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(event) => {
                setForm({ ...form, lastName: event.target.value });
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Email

          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
            }}
            className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
          />
        </label>

        <button
          type="submit"
          className="cursor-pointer rounded-lg border-0 bg-[#ef476f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#df3d65] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Čuvanje...' : 'Sačuvaj podatke'}
        </button>
      </fieldset>
    </form>
  );
}