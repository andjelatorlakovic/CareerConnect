import { useEffect, useState } from 'react';

import { userApi } from '../../api_services/users/UserApiService';

import type { User } from '../../models/users/User';
import type { UpdateUserRequest } from '../../types/users/UpdateUserRequest';
import type { ChangePasswordRequest } from '../../types/users/ChangePasswordRequest';

import { useAuth } from '../../hooks/auth/useAuth';

import CandidateLayout from '../../components/candidate/CandidateLayout';
import AccountForm from '../../components/candidate/AccountForm';
import ChangePasswordForm from '../../components/candidate/ChangePasswordForm';

export default function CandidateAccountPage() {
  const { user: authUser, login } = useAuth();

  const [account, setAccount] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        const data = await userApi.getMe();

        if (active) {
          setAccount(data);
        }
      } catch {
        if (active) {
          setError('Podaci naloga se ne mogu učitati.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const handleSaveAccount = async (
    request: UpdateUserRequest
  ) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updated = await userApi.updateMe(request);

      setAccount(updated);

      if (authUser) {
        login({
          token: authUser.token,
          email: updated.email,
          role: updated.role,
        });
      }

      setSuccess('Podaci naloga su uspešno sačuvani.');
    } catch {
      setError('Podatke naloga nije moguće sačuvati.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (
    request: ChangePasswordRequest
  ): Promise<boolean> => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await userApi.changePassword(request);

      setSuccess('Lozinka je uspešno promenjena.');
      return true;
    } catch {
      setError('Lozinka nije promenjena. Proverite trenutnu lozinku.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="grid min-h-[86vh] gap-6 rounded-2xl border border-solid border-[#dedde8] bg-white p-5 shadow-xl sm:p-8">
        <header className="border-0 border-b border-solid border-[#ebe9f1] pb-6">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-[#ef476f] sm:text-4xl">
            Podešavanja naloga
          </h1>

          <p className="m-0 mt-2 text-sm text-[#8c8c9a]">
            Izmenite lične podatke i lozinku.
          </p>
        </header>

        {loading && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Učitavanje naloga...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-solid border-[#d5ebdd] bg-[#edf8f1] p-4 text-[#287648]"
          >
            {success}
          </div>
        )}

        {!loading && account && (
          <>
            <section className="grid gap-5 rounded-xl border border-solid border-[#d9d9e2] bg-[#fafafd] p-5">
              <h2 className="m-0 border-0 border-l-4 border-solid border-[#ef476f] pl-3 text-lg font-bold text-[#333344]">
                Lični podaci
              </h2>

              <AccountForm
                initial={account}
                loading={saving}
                onSubmit={handleSaveAccount}
              />
            </section>

            <section className="grid gap-5 rounded-xl border border-solid border-[#d9d9e2] bg-[#fafafd] p-5">
              <h2 className="m-0 border-0 border-l-4 border-solid border-[#ef476f] pl-3 text-lg font-bold text-[#333344]">
                Promena lozinke
              </h2>

              <ChangePasswordForm
                loading={saving}
                onSubmit={handleChangePassword}
              />
            </section>
          </>
        )}
      </div>
    </CandidateLayout>
  );
}