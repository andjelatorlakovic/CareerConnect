import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api_services/auth/AuthApiService';
import { Role } from '../../models/auth/Role';
import type { RegisterRequest } from '../../types/auth/RegisterRequest';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.Candidate,
  });

  const [error, setError] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError('');

    const response = await authApi.register(form);

    if (!response.success) {
      setError(response.message);
      return;
    }

    navigate('/login');
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <input
        placeholder="Ime"
        value={form.firstName}
        onChange={(event) =>
          setForm({ ...form, firstName: event.target.value })
        }
        required
      />

      <input
        placeholder="Prezime"
        value={form.lastName}
        onChange={(event) =>
          setForm({ ...form, lastName: event.target.value })
        }
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) =>
          setForm({ ...form, email: event.target.value })
        }
        required
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={form.password}
        onChange={(event) =>
          setForm({ ...form, password: event.target.value })
        }
        minLength={6}
        required
      />

      <select
        value={form.role}
        onChange={(event) =>
          setForm({
            ...form,
            role: event.target.value as RegisterRequest['role'],
          })
        }
      >
        <option value={Role.Candidate}>Kandidat</option>
        <option value={Role.Company}>Kompanija</option>
      </select>

      <button type="submit">Registruj se</button>
    </form>
  );
}