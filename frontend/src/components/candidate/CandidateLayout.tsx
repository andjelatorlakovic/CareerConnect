import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth/useAuth';

interface CandidateLayoutProps {
  children: ReactNode;
}

export default function CandidateLayout({
  children,
}: CandidateLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const userLetter =
    user?.email?.charAt(0).toUpperCase() || 'K';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#19182d] text-left font-sans text-sm leading-normal text-[#333344] [color-scheme:light] [&_*]:box-border [&_button]:font-sans [&_input]:font-sans [&_select]:font-sans [&_textarea]:font-sans">
      <header className="flex flex-col items-center justify-between gap-5 border-0 border-b border-solid border-[#d9d9e2] bg-white px-6 py-5 lg:flex-row">
        <Link
          to="/jobs"
          className="text-3xl font-extrabold tracking-tight whitespace-nowrap text-[#ef476f] no-underline hover:text-[#d9365f]"
        >
          CareerConnect
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-semibold">
          <NavLink
            to="/jobs"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Oglasi
          </NavLink>

          <NavLink
            to="/matching-jobs"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Za tebe
          </NavLink>

          <NavLink
            to="/my-applications"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Moje prijave
          </NavLink>

          <NavLink
            to="/candidate-profile"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Moj profil
          </NavLink>

          <NavLink
            to="/notifications"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Obaveštenja
          </NavLink>

          <NavLink
            to="/account"
            className="border-0 border-b-2 border-solid border-transparent py-2 text-[#333344] no-underline hover:text-[#ef476f] [&.active]:border-[#ef476f] [&.active]:text-[#ef476f]"
          >
            Moj nalog
          </NavLink>

          <div
            className="relative"
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setProfileOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setProfileOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-label="Otvori meni naloga"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((previous) => !previous);
              }}
              className="grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-[#24233d] text-sm font-extrabold text-white transition hover:bg-[#ef476f]"
            >
              {userLetter}
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 z-50 mt-3 grid w-72 max-w-[85vw] gap-4 rounded-xl border border-solid border-[#dedde8] bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fce8ee] font-bold text-[#c8385c]">
                    {userLetter}
                  </div>

                  <div className="grid min-w-0 gap-1">
                    <span className="text-xs text-[#92919e]">
                      Prijavljeni ste kao
                    </span>

                    <strong className="text-sm break-all">
                      {user?.email}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-3 text-sm font-semibold text-[#c8385c] transition hover:bg-[#fce5ec]"
                >
                  Odjavi se
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="w-full p-3 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}