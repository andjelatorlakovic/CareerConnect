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

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-solid border-[#e3dfeb] bg-white p-5 sm:flex-row sm:items-center">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#24233d] text-lg font-bold text-[#f4d8e0]">
        {(user.firstName || user.email).charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        {isCompany ? (
          <Link
            to={`/admin/companies/${user.id}/jobs`}
            className="group grid gap-1 text-[#333344] no-underline"
          >
            <strong className="text-base break-words group-hover:text-[#ef476f]">
              {`${user.firstName} ${user.lastName}`.trim() || user.email}
            </strong>

            <span className="text-xs break-all text-[#858592]">
              {user.email}
            </span>

            <span className="mt-1 text-xs font-semibold text-[#c8385c]">
              Pogledaj oglase kompanije →
            </span>
          </Link>
        ) : (
          <div className="grid gap-1">
            <strong className="text-base break-words">
              {`${user.firstName} ${user.lastName}`.trim() || user.email}
            </strong>

            <span className="text-xs break-all text-[#858592]">
              {user.email}
            </span>
          </div>
        )}

        <p className="m-0 mt-2 text-xs text-[#92919e]">
          Registrovan:{' '}
          {new Date(user.createdAt).toLocaleDateString('sr-Latn-RS')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[#f2eef8] px-3 py-2 text-xs font-semibold text-[#665079]">
          {user.role === Role.Company
            ? 'Kompanija'
            : user.role === Role.Candidate
              ? 'Kandidat'
              : 'Administrator'}
        </span>

        <span
          className={
            user.isActive
              ? 'rounded-md bg-[#e9f7ed] px-3 py-2 text-xs font-semibold text-[#2c7b48]'
              : 'rounded-md bg-[#fff0f3] px-3 py-2 text-xs font-semibold text-[#b63255]'
          }
        >
          {user.isActive ? 'Aktivan' : 'Neaktivan'}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled || isCurrentUser}
        onClick={() => {
          void onToggleStatus(user);
        }}
        className="cursor-pointer rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-3 text-sm font-semibold text-[#c8385c] hover:bg-[#fce5ec] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCurrentUser
          ? 'Vaš nalog'
          : updating
            ? 'Čuvanje...'
            : user.isActive
              ? 'Deaktiviraj'
              : 'Aktiviraj'}
      </button>
    </article>
  );
}