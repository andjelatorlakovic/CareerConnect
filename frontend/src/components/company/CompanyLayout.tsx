import type { ReactNode } from 'react';
import { useState } from 'react';
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

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userLetter =
    user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="company-layout">
      <header className="company-header">

        {/* LOGO */}

        <Link
          to="/my-jobs"
          className="company-logo"
        >
          CareerConnect
        </Link>

        {/* NAVIGATION */}

        <nav className="company-nav">

          <Link
            to="/my-jobs"
            className="company-nav-link"
          >
            Moji oglasi
          </Link>

          <Link
            to="/create-job"
            className="company-nav-link"
          >
            Dodaj oglas
          </Link>

          <Link
            to="/company-profile"
            className="company-nav-link"
          >
            Profil kompanije
          </Link>
          
          {/* PROFILE */}

          <div className="profile-wrapper">

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              aria-label="Otvori profil"
              aria-expanded={profileOpen}
            >
              {userLetter}
            </button>

            {profileOpen && (
              <div className="profile-dropdown">

                <div className="profile-header">

                  <div className="profile-avatar">
                    {userLetter}
                  </div>

                  <div className="profile-info">
                    <span>
                      Prijavljeni ste kao
                    </span>

                    <strong>
                      {user?.email}
                    </strong>
                  </div>

                </div>

                <div className="profile-divider" />
                <Link
                  to="/account"
                  onClick={() => setProfileOpen(false)}
                  className="border-0 border-t border-solid border-[#ebe9f1] pt-4 text-sm font-semibold text-[#c8385c] no-underline"
                >
                  Podešavanja naloga
                </Link>
                <button
                  type="button"
                  className="dropdown-logout"
                  onClick={handleLogout}
                >
                  <span className="logout-icon">
                    ↪
                  </span>

                  Odjavi se
                </button>

              </div>
            )}

          </div>

        </nav>
      </header>

      <main className="company-main">
        {children}
      </main>

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* ========================================
           LAYOUT
        ======================================== */

        .company-layout {
          width: 100%;
          min-height: 100vh;

          margin: 0;
          padding: 0;

          background: #19182d;
        }

        /* ========================================
           HEADER
        ======================================== */

        .company-header {
          width: 100%;
          min-height: 8vh;

          padding: 1.2% 3.5%;

          background: #ffffff;

          border-bottom: 1px solid #d9d9e2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 3%;

          box-shadow:
            0 2px 10px
            rgba(25, 24, 45, 0.08);
        }

        /* ========================================
           LOGO
        ======================================== */

        .company-logo {
          color: #ef476f;

          text-decoration: none;

          font-size: clamp(22px, 2vw, 32px);
          font-weight: 800;

          letter-spacing: -0.5px;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            opacity 0.2s ease;
        }

        .company-logo:hover {
          color: #d9365f;
          opacity: 0.9;
        }

        /* ========================================
           NAVIGATION
        ======================================== */

        .company-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: clamp(14px, 1.8vw, 30px);

          flex-wrap: wrap;
        }

        /* ========================================
           NAV LINKS
        ======================================== */

        .company-nav-link {
          position: relative;

          color: #333344;

          text-decoration: none;

          font-size: clamp(14px, 1vw, 17px);
          font-weight: 600;

          padding: 0.5em 0;

          white-space: nowrap;

          transition:
            color 0.2s ease;
        }

        .company-nav-link::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: 0;

          width: 0;
          height: 2px;

          background: #ef476f;

          border-radius: 2px;

          transition:
            width 0.2s ease;
        }

        .company-nav-link:hover {
          color: #ef476f;
        }

        .company-nav-link:hover::after {
          width: 100%;
        }

        /* ========================================
           PROFILE WRAPPER
        ======================================== */

        .profile-wrapper {
          position: relative;

          display: flex;
          align-items: center;
        }

        /* ========================================
           PROFILE BUTTON
        ======================================== */

        .profile-button {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 50%;

          background: #24233d;
          color: #ffffff;

          font-family: inherit;

          font-size: 15px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 4px 10px
            rgba(36, 35, 61, 0.18);

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .profile-button:hover {
          background: #ef476f;

          transform: translateY(-1px);

          box-shadow:
            0 6px 14px
            rgba(239, 71, 111, 0.25);
        }

        /* ========================================
           PROFILE DROPDOWN
        ======================================== */

        .profile-dropdown {
          position: absolute;

          top: calc(100% + 12px);
          right: 0;

          width: min(320px, 80vw);

          padding: 1rem;

          background: #ffffff;

          border: 1px solid #dedde8;

          border-radius: 13px;

          box-shadow:
            0 14px 35px
            rgba(25, 24, 45, 0.18);

          z-index: 100;
        }

        /* ========================================
           DROPDOWN HEADER
        ======================================== */

        .profile-header {
          display: flex;
          align-items: center;

          gap: 0.8rem;
        }

        /* ========================================
           DROPDOWN AVATAR
        ======================================== */

        .profile-avatar {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: #fce8ee;

          border: 1px solid #f2ccd8;

          border-radius: 50%;

          color: #c8385c;

          font-size: 15px;
          font-weight: 800;
        }

        /* ========================================
           PROFILE INFO
        ======================================== */

        .profile-info {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 0.2rem;
        }

        .profile-info span {
          color: #92919e;

          font-size: 10px;
          font-weight: 600;
        }

        .profile-info strong {
          max-width: 230px;

          color: #333344;

          font-size: 13px;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ========================================
           DIVIDER
        ======================================== */

        .profile-divider {
          width: 100%;
          height: 1px;

          margin: 0.9rem 0;

          background: #ebe9f1;
        }

        /* ========================================
           LOGOUT BUTTON
        ======================================== */

        .dropdown-logout {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 0.5rem;

          padding: 0.65rem 0.9rem;

          border: 1px solid #f0c4d0;

          border-radius: 8px;

          background: #fff3f6;

          color: #c8385c;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .dropdown-logout:hover {
          background: #ef476f;

          border-color: #ef476f;

          color: #ffffff;
        }

        .logout-icon {
          font-size: 15px;
          line-height: 1;
        }

        /* ========================================
           MAIN
        ======================================== */

        .company-main {
          width: 100%;
          min-height: 92vh;

          margin: 0;
          padding: 0;

          background: #19182d;
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 900px) {

          .company-header {
            padding: 2% 3%;

            flex-direction: column;
            align-items: center;

            gap: 1.5rem;
          }

          .company-nav {
            justify-content: center;
          }

        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 600px) {

          .company-header {
            padding: 4% 5%;

            gap: 1.2rem;
          }

          .company-logo {
            font-size: 25px;
          }

          .company-nav {
            width: 100%;

            justify-content: center;

            gap: 12px 18px;
          }

          .profile-button {
            width: 40px;
            height: 40px;
          }

          .profile-dropdown {
            right: -5px;

            width: min(300px, 85vw);
          }

        }

      `}</style>
    </div>
  );
}
