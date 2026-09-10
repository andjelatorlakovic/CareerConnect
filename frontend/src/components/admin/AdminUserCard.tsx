import { Link } from 'react-router-dom';

import type { User } from '../../models/users/User';
import { Role } from '../../models/auth/Role';

interface AdminUserCardProps {
  user: User;
  currentUserId: string;
  disabled: boolean;
  updating: boolean;
  onToggleStatus: (user: User) => Promise<void>;
}

export default function AdminUserCard({
  user,
  currentUserId,
  disabled,
  updating,
  onToggleStatus,
}: AdminUserCardProps) {
  const isCompany = user.role === Role.Company;
  const isCurrentUser = user.id === currentUserId;

  const fullName =
    `${user.firstName} ${user.lastName}`.trim() || user.email;

  const initials =
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`
      .toUpperCase() || user.email.charAt(0).toUpperCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-solid border-[#e5e2ed] bg-white text-left shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className={
              isCompany
                ? 'grid size-14 shrink-0 place-items-center rounded-2xl border border-solid border-[#f5d5df] bg-[#fff0f4] text-lg font-bold tracking-wide text-[#c8385c]'
                : 'grid size-14 shrink-0 place-items-center rounded-2xl border border-solid border-[#e4def0] bg-[#f1edf8] text-lg font-bold tracking-wide text-[#665079]'
            }
          >
            {initials}
          </div>

          <div className="min-w-0">
            {isCompany ? (
              <Link
                to={`/admin/companies/${user.id}/jobs`}
                className="rounded text-lg font-bold break-words text-[#29283e] no-underline transition-colors hover:text-[#ef476f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef476f]"
              >
                {fullName}
              </Link>
            ) : (
              <h3 className="m-0 text-lg font-bold break-words text-[#29283e]">
                {fullName}
              </h3>
            )}

            <p className="m-0 mt-1.5 text-sm break-all text-[#777586]">
              {user.email}
            </p>

            {isCurrentUser && (
              <span className="mt-2 inline-block text-xs font-semibold text-[#a13b60]">
                Vaš nalog
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <span className="inline-flex items-center rounded-full border border-solid border-[#e6e1ee] bg-[#f7f5fb] px-3 py-1.5 text-xs font-semibold text-[#6b5c80]">
            {isCompany
              ? 'Kompanija'
              : user.role === Role.Candidate
                ? 'Kandidat'
                : 'Administrator'}
          </span>

          <span
            className={
              user.isActive
                ? 'inline-flex items-center gap-2 rounded-full border border-solid border-[#d9ecdf] bg-[#eef8f1] px-3 py-1.5 text-xs font-semibold text-[#327449]'
                : 'inline-flex items-center gap-2 rounded-full border border-solid border-[#eedce2] bg-[#fcf1f4] px-3 py-1.5 text-xs font-semibold text-[#a34962]'
            }
          >
            <span
              aria-hidden="true"
              className={
                user.isActive
                  ? 'size-1.5 rounded-full bg-[#429a62]'
                  : 'size-1.5 rounded-full bg-[#c06b83]'
              }
            />

            {user.isActive ? 'Aktivan' : 'Neaktivan'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-0 border-t border-solid border-[#eeebf3] bg-[#fcfbfe] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex shrink-0 items-center gap-2 text-xs text-[#858292]">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M16 3v4M8 3v4M3 11h18" />
          </svg>

          <span>
            Registrovan{' '}
            <time
              dateTime={user.createdAt}
              className="font-medium text-[#625f73]"
            >
              {new Date(user.createdAt).toLocaleDateString(
                'sr-Latn-RS'
              )}
            </time>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:ml-auto">
          <button
            type="button"
            disabled={disabled || updating || isCurrentUser}
            aria-label={
              isCurrentUser
                ? 'Ne možete deaktivirati sopstveni nalog'
                : `${user.isActive ? 'Deaktiviraj' : 'Aktiviraj'} nalog: ${fullName}`
            }
            onClick={() => {
              void onToggleStatus(user);
            }}
            className={
              user.isActive
                ? 'inline-flex min-h-10 items-center justify-center rounded-lg border border-solid border-[#ebd4dc] bg-white px-4 py-2 text-xs font-semibold text-[#b34463] transition-colors hover:border-[#dfafbf] hover:bg-[#fff2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef476f] disabled:cursor-not-allowed disabled:opacity-45 enabled:cursor-pointer'
                : 'inline-flex min-h-10 items-center justify-center rounded-lg border border-solid border-[#cfe3d5] bg-[#eef8f1] px-4 py-2 text-xs font-semibold text-[#327449] transition-colors hover:border-[#aacfb6] hover:bg-[#e1f2e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327449] disabled:cursor-not-allowed disabled:opacity-45 enabled:cursor-pointer'
            }
          >
            {updating
              ? 'Čuvanje...'
              : isCurrentUser
                ? 'Vaš nalog'
                : user.isActive
                  ? 'Deaktiviraj'
                  : 'Aktiviraj'}
          </button>

          {isCompany && (
            <Link
              to={`/admin/companies/${user.id}/jobs`}
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-solid border-[#24233d] bg-[#24233d] px-4 py-2 text-xs font-semibold text-white no-underline transition-colors hover:border-[#393750] hover:bg-[#393750] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef476f]"
            >
              Pogledaj oglase

              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}