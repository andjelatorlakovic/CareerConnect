import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth/useAuth';

interface CompanyLayoutProps {
  children: ReactNode;
}

export default function CompanyLayout({
  children,
}: CompanyLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <Link to="/my-jobs">CareerConnect</Link>

        <nav>
          <Link to="/my-jobs">Moji oglasi</Link>
          <Link to="/create-job">Novi oglas</Link>
          <Link to="/company-profile">
            Profil kompanije
          </Link>

          <span>{user?.email}</span>

          <button onClick={handleLogout}>
            Odjavi se
          </button>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}