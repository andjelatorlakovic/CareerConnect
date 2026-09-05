import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type { CompanyProfile } from '../../models/company/CompanyProfile';
import type { UpdateCompanyProfileRequest } from '../../types/company/UpdateCompanyProfileRequest';

interface CompanyProfileFormProps{
    initial: CompanyProfile;
    loading: boolean;
    onSubmit: (data: UpdateCompanyProfileRequest) => void;
}

export default function CompanyProfileForm({
  initial,
  loading,
  onSubmit,
}: CompanyProfileFormProps) {
    const [form, setForm] = useState<UpdateCompanyProfileRequest>({
        name: initial.name,
        description: initial.description,
        location: initial.location,
        website: initial.website,
        industry: initial.industry,
        contactEmail: initial.contactEmail,
        contactPhone: initial.contactPhone,
    });
    const setField = (
    field: keyof UpdateCompanyProfileRequest,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Company name</label>
      <input
        value={form.name}
        onChange={(event) =>
          setField('name', event.target.value)
        }
        required
      />

      <label>Company description</label>
      <textarea
        value={form.description}
        onChange={(event) =>
          setField('description', event.target.value)
        }
        rows={6}
      />

      <label>Industry</label>
      <input
        value={form.industry}
        onChange={(event) =>
          setField('industry', event.target.value)
        }
      />

      <label>Location</label>
      <input
        value={form.location}
        onChange={(event) =>
          setField('location', event.target.value)
        }
      />

      <label>Website</label>
      <input
        type="url"
        value={form.website}
        onChange={(event) =>
          setField('website', event.target.value)
        }
      />
      <label>Contact email</label>
      <input
        type="email"
        value={form.contactEmail}
        onChange={(event) =>
          setField('contactEmail', event.target.value)
        }
      />

      <label>Contact phone</label>
      <input
        value={form.contactPhone}
        onChange={(event) =>
          setField('contactPhone', event.target.value)
        }
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
    );
}