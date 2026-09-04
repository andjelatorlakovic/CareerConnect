import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../shared/ErrorMessage';

export default function LoginForm() {
  const { login: setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const user = await login({
        email,
        password,
      });

      setUser(user);

      if (user.role === 'Candidate') {
        navigate('/jobs');
      } else if (user.role === 'Company') {
        navigate('/my-jobs');
      } else {
        navigate('/admin/users');
      }
    } catch {
      setError('Pogrešan email ili lozinka.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={form}>
      {error && <ErrorMessage message={error} />}

      <input
        type="email"
        placeholder="Email adresa"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        style={input}
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        style={input}
      />

      <button type="submit" disabled={loading} style={button}>
        {loading ? 'Prijava...' : 'Prijavi se'}
      </button>
    </form>
  );
}

const form: React.CSSProperties = {
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