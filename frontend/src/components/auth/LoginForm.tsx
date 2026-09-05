import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api_services/auth/AuthApiService';
import { useAuth } from '../../hooks/auth/useAuth';
import { Role } from '../../models/auth/Role';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError('');

    const response = await authApi.login({ email, password });

    if (!response.success || !response.data) {
      setError(response.message);
      return;
    }

    login(response.data);

    if (response.data.role === Role.Company) {
      navigate('/my-jobs');
    } else if (response.data.role === Role.Candidate) {
      navigate('/jobs');
    } else {
      navigate('/admin/users');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">Prijavi se</button>
    </form>
  );
}