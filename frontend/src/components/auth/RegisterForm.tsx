import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '../../api/auth';
import ErrorMessage from '../shared/ErrorMessage';

import type { RegisterRequest } from '../../types/RegisterRequest';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Candidate',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof RegisterRequest,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      await register(form);

      navigate('/login');
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      setError(
        response?.data?.message ??
          'Greška pri registraciji.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={formStyle}
    >
      {error && (
        <ErrorMessage message={error} />
      )}

      <input
        placeholder="Ime"
        value={form.firstName}
        onChange={(event) =>
          handleChange(
            'firstName',
            event.target.value
          )
        }
        required
        style={input}
      />

      <input
        placeholder="Prezime"
        value={form.lastName}
        onChange={(event) =>
          handleChange(
            'lastName',
            event.target.value
          )
        }
        required
        style={input}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) =>
          handleChange(
            'email',
            event.target.value
          )
        }
        required
        style={input}
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={form.password}
        onChange={(event) =>
          handleChange(
            'password',
            event.target.value
          )
        }
        required
        style={input}
      />

      <select
        value={form.role}
        onChange={(event) =>
          handleChange(
            'role',
            event.target.value
          )
        }
        style={input}
      >
        <option value="Candidate">
          Kandidat
        </option>

        <option value="Company">
          Kompanija
        </option>
      </select>

      <button
        type="submit"
        disabled={loading}
        style={button}
      >
        {loading
          ? 'Registracija...'
          : 'Registruj se'}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const input: React.CSSProperties = {
  padding: '12px 14px',
  border: '1px solid #ddd',
  borderRadius: 8,
  fontSize: 15,
};

const button: React.CSSProperties = {
  padding: 14,
  background: '#e94560',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 15,
};