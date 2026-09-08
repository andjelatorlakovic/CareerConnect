import { useState, type FormEvent } from 'react';

import type { ChangePasswordRequest } from '../../types/users/ChangePasswordRequest';

interface ChangePasswordFormProps {
  loading: boolean;

  onSubmit: (
    request: ChangePasswordRequest
  ) => Promise<boolean>;
}

export default function ChangePasswordForm({
  loading,
  onSubmit,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');

    if (newPassword !== confirmation) {
      setError('Nove lozinke se ne poklapaju.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Nova lozinka mora biti drugačija od trenutne.');
      return;
    }

    const success = await onSubmit({
      currentPassword,
      newPassword,
    });

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-sm text-[#a43651]"
        >
          {error}
        </div>
      )}

      <fieldset
        disabled={loading}
        className="m-0 grid min-w-0 gap-5 border-0 p-0"
      >
        <label className="grid gap-2 text-sm font-semibold">
          Trenutna lozinka

          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
            }}
            className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Nova lozinka

            <input
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Potvrdi novu lozinku

            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
              }}
              className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f] focus:ring-2 focus:ring-[#ef476f]/15"
            />
          </label>
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-lg border-0 bg-[#ef476f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#df3d65] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Čuvanje...' : 'Promeni lozinku'}
        </button>
      </fieldset>
    </form>
  );
}