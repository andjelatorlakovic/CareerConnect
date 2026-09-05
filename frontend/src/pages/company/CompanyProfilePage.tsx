import { useEffect, useState } from 'react';

import { companyApi } from '../../api_services/company/CompanyApiService';
import CompanyLayout from '../../components/company/CompanyLayout';
import CompanyProfileForm from '../../components/company/CompanyProfileForm';

import type { CompanyProfile } from '../../models/company/CompanyProfile';
import type { UpdateCompanyProfileRequest } from '../../types/company/UpdateCompanyProfileRequest';

export default function CompanyProfilePage() {
  const [profile, setProfile] =
    useState<CompanyProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setProfile(await companyApi.getCompanyProfile());
      } catch {
        setError('Profil kompanije nije moguće učitati.');
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  const handleSubmit = async (
    data: UpdateCompanyProfileRequest
  ) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updated = await companyApi.updateCompanyProfile(
        data
      );

      setProfile(updated);
      setSuccess('Profil je uspešno sačuvan.');
    } catch {
      setError('Profil nije moguće sačuvati.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CompanyLayout>


      {loading && <p>Učitavanje...</p>}
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {profile && (
        <CompanyProfileForm
          initial={profile}
          loading={saving}
          onSubmit={(data) => void handleSubmit(data)}
        />
      )}
    </CompanyLayout>
  );
}