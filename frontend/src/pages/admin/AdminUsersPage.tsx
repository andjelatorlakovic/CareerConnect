import { useEffect, useState } from 'react';

import { userApi } from '../../api_services/users/UserApiService';

import type { User } from '../../models/users/User';

import { Role } from '../../models/auth/Role';

import AdminLayout from '../../components/admin/AdminLayout';
import AdminUserCard from '../../components/admin/AdminUserCard';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');

  const [statusFilter, setStatusFilter] =
    useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const [usersData, currentUser] = await Promise.all([
          userApi.getAllUsers(),
          userApi.getMe(),
        ]);

        if (active) {
          setUsers(usersData);
          setCurrentUserId(currentUser.id);
        }
      } catch {
        if (active) {
          setError('Korisnici se ne mogu učitati.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (selectedUser: User) => {
    if (
      updatingId !== null ||
      selectedUser.id === currentUserId
    ) {
      return;
    }

    try {
      setUpdatingId(selectedUser.id);
      setActionError('');
      setSuccess('');

      if (selectedUser.isActive) {
        await userApi.deactivateUser(selectedUser.id);
      } else {
        await userApi.activateUser(selectedUser.id);
      }

      setUsers((previous) =>
        previous.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                isActive: !selectedUser.isActive,
              }
            : user
        )
      );

      setSuccess(
        selectedUser.isActive
          ? 'Korisnik je deaktiviran.'
          : 'Korisnik je aktiviran.'
      );
    } catch {
      setActionError('Status korisnika nije moguće promeniti.');
    } finally {
      setUpdatingId(null);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesRole =
      roleFilter === '' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="grid min-h-[86vh] content-start gap-6 rounded-2xl border border-solid border-[#dedde8] bg-white p-5 shadow-xl sm:p-8">
        <header className="border-0 border-b border-solid border-[#ebe9f1] pb-6">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-[#ef476f] sm:text-4xl">
            Korisnici
          </h1>

          <p className="m-0 mt-2 text-sm text-[#8c8c9a]">
            Upravljajte korisnicima. Klik na kompaniju otvara njene oglase.
          </p>
        </header>

        {loading && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Učitavanje korisnika...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {actionError}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-solid border-[#d5ebdd] bg-[#edf8f1] p-4 text-[#287648]"
          >
            {success}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="grid gap-2 rounded-xl border border-solid border-[#e2deed] bg-[#f5f2fa] p-4">
                <span className="text-xs text-[#858092]">
                  Ukupno korisnika
                </span>

                <strong className="text-2xl">{users.length}</strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#e2deed] bg-[#f5f2fa] p-4">
                <span className="text-xs text-[#858092]">
                  Kandidati
                </span>

                <strong className="text-2xl">
                  {users.filter((user) => user.role === Role.Candidate).length}
                </strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#e2deed] bg-[#f5f2fa] p-4">
                <span className="text-xs text-[#858092]">
                  Kompanije
                </span>

                <strong className="text-2xl">
                  {users.filter((user) => user.role === Role.Company).length}
                </strong>
              </div>

              <div className="grid gap-2 rounded-xl border border-solid border-[#d5ebdd] bg-[#edf8f1] p-4">
                <span className="text-xs text-[#6d8b75]">
                  Aktivni korisnici
                </span>

                <strong className="text-2xl">
                  {users.filter((user) => user.isActive).length}
                </strong>
              </div>
            </div>

            <div className="grid gap-4 rounded-xl border border-solid border-[#d9d9e2] bg-[#fafafd] p-5 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold">
                Pretraga

                <input
                  value={search}
                  placeholder="Ime, prezime ili email"
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f]"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Uloga

                <select
                  value={roleFilter}
                  onChange={(event) => {
                    setRoleFilter(event.target.value as Role | '');
                  }}
                  className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f]"
                >
                  <option value="">Sve uloge</option>
                  <option value={Role.Candidate}>Kandidati</option>
                  <option value={Role.Company}>Kompanije</option>
                  <option value={Role.Admin}>Administratori</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Status

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target.value as 'all' | 'active' | 'inactive'
                    );
                  }}
                  className="w-full rounded-lg border border-solid border-[#d9d9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#ef476f]"
                >
                  <option value="all">Svi korisnici</option>
                  <option value="active">Aktivni</option>
                  <option value="inactive">Neaktivni</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 text-lg font-bold text-[#333344]">
                Lista korisnika
              </h2>

              <span className="text-xs text-[#858592]">
                Pronađeno: {filteredUsers.length}
              </span>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="m-0 py-10 text-center text-[#858592]">
                Nema korisnika koji odgovaraju izabranim filterima.
              </p>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <AdminUserCard
                    key={user.id}
                    user={user}
                    currentUserId={currentUserId}
                    disabled={updatingId !== null}
                    updating={updatingId === user.id}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}