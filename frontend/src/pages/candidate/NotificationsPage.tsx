import { useEffect, useState } from 'react';

import { notificationApi } from '../../api_services/notifications/NotificationApiService';

import type { UserNotification } from '../../models/notifications/UserNotification';

import CandidateLayout from '../../components/candidate/CandidateLayout';

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<UserNotification[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const data = await notificationApi.getMyNotifications();

        if (active) {
          setNotifications(data);
        }
      } catch {
        if (active) {
          setError('Obaveštenja se ne mogu učitati.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      setSaving(true);
      setActionError('');
      setSuccess('');

      await notificationApi.markNotificationAsRead(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch {
      setActionError('Obaveštenje nije označeno kao pročitano.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setSaving(true);
      setActionError('');
      setSuccess('');

      await notificationApi.markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, isRead: true }))
      );

      setSuccess('Sva obaveštenja su označena kao pročitana.');
    } catch {
      setActionError('Obaveštenja nisu označena kao pročitana.');
    } finally {
      setSaving(false);
    }
  };

  const unreadCount =
    notifications.filter((item) => !item.isRead).length;

  return (
    <CandidateLayout>
      <div className="grid min-h-[86vh] gap-6 rounded-2xl border border-solid border-[#dedde8] bg-white p-5 shadow-xl sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-0 border-b border-solid border-[#ebe9f1] pb-6">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-[#ef476f] sm:text-4xl">
              Obaveštenja
            </h1>

            <p className="m-0 mt-2 text-sm text-[#8c8c9a]">
              Pratite promene statusa svojih prijava.
            </p>
          </div>

          {!loading && !error && unreadCount > 0 && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                void handleMarkAllAsRead();
              }}
              className="cursor-pointer rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-3 text-sm font-semibold text-[#c8385c] hover:bg-[#fce5ec] disabled:opacity-60"
            >
              Označi sve kao pročitano
            </button>
          )}
        </header>

        {loading && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Učitavanje obaveštenja...
          </p>
        )}

        {(error || actionError) && (
          <div
            role="alert"
            className="rounded-lg border border-solid border-[#f2c5ce] bg-[#fff2f4] p-4 text-[#a43651]"
          >
            {error || actionError}
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
          notifications.length === 0 ? (
            <div className="grid justify-items-center gap-3 py-10 text-center">
              <h2 className="m-0 text-lg font-bold text-[#333344]">
                Nemate obaveštenja
              </h2>

              <p className="m-0 text-sm text-[#858592]">
                Nova obaveštenja biće prikazana ovde.
              </p>
            </div>
          ) : (
            <>
              <p className="m-0 text-sm text-[#858592]">
                Nepročitana obaveštenja: {unreadCount}
              </p>

              <div className="grid gap-4">
                {[...notifications]
                  .sort(
                    (first, second) =>
                      new Date(second.createdAt).getTime() -
                      new Date(first.createdAt).getTime()
                  )
                  .map((notification) => (
                    <article
                      key={notification.id}
                      className={
                        notification.isRead
                          ? 'grid gap-4 rounded-xl border border-solid border-[#e3dfeb] border-l-4 border-l-[#24233d] bg-white p-5'
                          : 'grid gap-4 rounded-xl border border-solid border-[#e3dfeb] border-l-4 border-l-[#ef476f] bg-[#fff7fa] p-5'
                      }
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="m-0 text-base font-bold text-[#333344]">
                          {notification.isRead
                            ? 'Obaveštenje'
                            : 'Novo obaveštenje'}
                        </h3>

                        <span className="text-xs text-[#858592]">
                          {new Date(notification.createdAt)
                            .toLocaleDateString('sr-Latn-RS')}
                        </span>
                      </div>

                      <p className="m-0 text-sm leading-relaxed break-words">
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            void handleMarkAsRead(notification.id);
                          }}
                          className="w-fit cursor-pointer rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-2 text-sm font-semibold text-[#c8385c] hover:bg-[#fce5ec] disabled:opacity-60"
                        >
                          Označi kao pročitano
                        </button>
                      )}
                    </article>
                  ))}
              </div>
            </>
          )
        )}
      </div>
    </CandidateLayout>
  );
}