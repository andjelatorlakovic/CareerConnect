import { useState } from 'react';

import type { CompanyProfile } from '../../models/company/CompanyProfile';
import type { UpdateCompanyProfileRequest } from '../../types/company/UpdateCompanyProfileRequest';

interface CompanyProfileFormProps {
  initial: CompanyProfile;
  loading: boolean;
  onSubmit: (data: UpdateCompanyProfileRequest) => void;
}

export default function CompanyProfileForm({
  initial,
  loading,
  onSubmit,
}: CompanyProfileFormProps) {
  const [form, setForm] =
    useState<UpdateCompanyProfileRequest>({
      name: initial.name,
      description: initial.description,
      location: initial.location,
      website: initial.website,
      industry: initial.industry,
      contactEmail: initial.contactEmail,
      contactPhone: initial.contactPhone,
    });

  const setField = (
    field: keyof UpdateCompanyProfileRequest,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit(form);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        /* ========================================
           PAGE
        ======================================== */

        .company-profile-page {
          width: 100%;
          min-height: 100vh;

          padding: 0.7%;

          background: #19182d;
        }

        /* ========================================
           MAIN CARD
        ======================================== */

        .company-profile-card {
          width: 99.6%;
          min-height: 98.6vh;

          margin: 0 auto;

          padding: 2.5% 3.5% 3.5%;

          background: #ffffff;

          border-radius: 18px;

          box-shadow:
            0 15px 40px
            rgba(0, 0, 0, 0.25);
        }

        /* ========================================
           HEADER
        ======================================== */

        .company-profile-header {
          text-align: center;

          margin-bottom: 2.5%;

          padding: 1% 2% 2%;

          border-bottom:
            1px solid #eeeef3;
        }

        .company-profile-header h1 {
          margin: 0;

          color: #ef476f;

          font-size: clamp(
            30px,
            3vw,
            44px
          );

          font-weight: 700;

          letter-spacing: -1.5px;
        }

        .company-profile-header p {
          margin: 0.7% 0 0;

          color: #8c8c9a;

          font-size: clamp(
            14px,
            1.2vw,
            17px
          );
        }

        /* ========================================
           FORM
        ======================================== */

        .company-profile-form {
          display: flex;

          flex-direction: column;

          gap: 1.3vw;

          width: 100%;
        }

        /* ========================================
           SECTION
        ======================================== */

        .company-profile-section {
          width: 100%;

          padding: 1.4% 1.7%;

          background: #fafafd;

          border: 1px solid #d9d9e2;

          border-radius: 10px;
        }

        .company-profile-section h2 {
          margin: 0 0 1.2%;

          color: #333344;

          font-size: clamp(
            16px,
            1.2vw,
            19px
          );

          font-weight: 700;
        }

        .company-profile-section p {
          margin: -0.7% 0 1.4%;

          color: #8c8c9a;

          font-size: clamp(
            12px,
            0.9vw,
            14px
          );
        }

        /* ========================================
           GRID
        ======================================== */

        .company-profile-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 2.2%;

          width: 100%;

          margin-bottom: 1.3vw;
        }

        .company-profile-row:last-child {
          margin-bottom: 0;
        }

        /* ========================================
           FORM GROUP
        ======================================== */

        .company-profile-group {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          gap: 8px;

          width: 100%;
        }

        .company-profile-group.full-width {
          grid-column: 1 / -1;
        }

        .company-profile-group label {
          display: block;

          width: 100%;

          text-align: left;

          color: #333344;

          font-size: clamp(
            13px,
            1vw,
            15px
          );

          font-weight: 600;
        }

        /* ========================================
           INPUTS
        ======================================== */

        .company-profile-form input,
        .company-profile-form textarea {
          width: 100%;

          box-sizing: border-box;

          padding: 0 1.2%;

          background: #ffffff;

          border: 1px solid #d9d9e2;

          border-radius: 9px;

          color: #333344;

          font-family: inherit;

          font-size: clamp(
            14px,
            1vw,
            16px
          );

          outline: none;

          transition: all 0.2s ease;
        }

        .company-profile-form input {
          height: 3vw;

          min-height: 45px;
        }

        .company-profile-form textarea {
          min-height: 8vw;

          padding: 15px;

          resize: vertical;

          line-height: 1.5;
        }

        .company-profile-form input::placeholder,
        .company-profile-form textarea::placeholder {
          color: #a6a6b2;
        }

        .company-profile-form input:hover,
        .company-profile-form textarea:hover {
          border-color: #c7c7d2;
        }

        .company-profile-form input:focus,
        .company-profile-form textarea:focus {
          border-color: #ef476f;

          background: #ffffff;

          box-shadow:
            0 0 0 3px
            rgba(239, 71, 111, 0.12);
        }

        /* ========================================
           SAVE BUTTON
        ======================================== */

        .company-profile-submit {
          width: 100%;

          height: 3.2vw;

          min-height: 46px;

          margin-top: 0.3%;

          border: none;

          border-radius: 9px;

          background: #ef476f;

          color: #ffffff;

          font-size: clamp(
            14px,
            1.1vw,
            17px
          );

          font-weight: 600;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .company-profile-submit:hover:not(:disabled) {
          background: #df3d65;

          transform: translateY(-1px);

          box-shadow:
            0 6px 15px
            rgba(239, 71, 111, 0.25);
        }

        .company-profile-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .company-profile-submit:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 700px) {

          .company-profile-page {
            padding: 0.5%;
          }

          .company-profile-card {
            width: 99.5%;

            padding: 5% 4%;
          }

          .company-profile-row {
            grid-template-columns: 1fr;

            gap: 20px;

            margin-bottom: 20px;
          }

          .company-profile-group.full-width {
            grid-column: auto;
          }

          .company-profile-section {
            padding: 4%;
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 450px) {

          .company-profile-page {
            padding: 0;
          }

          .company-profile-card {
            width: 100%;

            min-height: 100vh;

            border-radius: 12px;

            padding: 7% 5%;
          }

          .company-profile-header {
            margin-bottom: 7%;
          }

          .company-profile-header h1 {
            font-size: 30px;
          }

          .company-profile-header p {
            font-size: 13px;

            line-height: 1.5;
          }

          .company-profile-section {
            padding: 5%;

            border-radius: 9px;
          }

          .company-profile-section h2 {
            font-size: 17px;

            margin-bottom: 5%;
          }

          .company-profile-section p {
            margin-bottom: 5%;
          }

          .company-profile-form input {
            min-height: 45px;
          }

          .company-profile-form textarea {
            min-height: 150px;
          }
        }
      `}</style>

      <div className="company-profile-page">

        <div className="company-profile-card">

          {/* HEADER */}

          <div className="company-profile-header">

            <h1>
              Profil kompanije
            </h1>

            <p>
              Unesite informacije o vašoj kompaniji
            </p>

          </div>

          <form
            className="company-profile-form"
            onSubmit={handleSubmit}
          >

            {/* OSNOVNE INFORMACIJE */}

            <section className="company-profile-section">

              <h2>
                Osnovne informacije
              </h2>

              <p>
                Osnovni podaci o kompaniji
              </p>

              {/* NAZIV */}

              <div className="company-profile-row">

                <div className="company-profile-group full-width">

                  <label htmlFor="company-name">
                    Naziv kompanije
                  </label>

                  <input
                    id="company-name"
                    value={form.name}
                    onChange={(event) =>
                      setField(
                        'name',
                        event.target.value
                      )
                    }
                    placeholder="Unesite naziv kompanije"
                    required
                  />

                </div>

              </div>

              {/* INDUSTRIJA + LOKACIJA */}

              <div className="company-profile-row">

                <div className="company-profile-group">

                  <label htmlFor="industry">
                    Industrija
                  </label>

                  <input
                    id="industry"
                    value={form.industry}
                    onChange={(event) =>
                      setField(
                        'industry',
                        event.target.value
                      )
                    }
                    placeholder="Npr. IT, Finansije..."
                  />

                </div>

                <div className="company-profile-group">

                  <label htmlFor="location">
                    Lokacija
                  </label>

                  <input
                    id="location"
                    value={form.location}
                    onChange={(event) =>
                      setField(
                        'location',
                        event.target.value
                      )
                    }
                    placeholder="Npr. Novi Sad"
                  />

                </div>

              </div>

              {/* OPIS */}

              <div className="company-profile-row">

                <div className="company-profile-group full-width">

                  <label htmlFor="description">
                    Opis kompanije
                  </label>

                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      setField(
                        'description',
                        event.target.value
                      )
                    }
                    placeholder="Unesite opis kompanije, delatnosti i osnovne informacije..."
                    rows={6}
                  />

                </div>

              </div>

            </section>

            {/* KONTAKT INFORMACIJE */}

            <section className="company-profile-section">

              <h2>
                Kontakt informacije
              </h2>

              <p>
                Načini kontakta sa kompanijom
              </p>

              {/* WEBSITE + EMAIL */}

              <div className="company-profile-row">

                <div className="company-profile-group">

                  <label htmlFor="website">
                    Website
                  </label>

                  <input
                    id="website"
                    type="url"
                    value={form.website}
                    onChange={(event) =>
                      setField(
                        'website',
                        event.target.value
                      )
                    }
                    placeholder="https://example.com"
                  />

                </div>

                <div className="company-profile-group">

                  <label htmlFor="contact-email">
                    Kontakt email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) =>
                      setField(
                        'contactEmail',
                        event.target.value
                      )
                    }
                    placeholder="kontakt@kompanija.com"
                  />

                </div>

              </div>

              {/* TELEFON */}

              <div className="company-profile-row">

                <div className="company-profile-group">

                  <label htmlFor="contact-phone">
                    Kontakt telefon
                  </label>

                  <input
                    id="contact-phone"
                    value={form.contactPhone}
                    onChange={(event) =>
                      setField(
                        'contactPhone',
                        event.target.value
                      )
                    }
                    placeholder="+381 60 123 4567"
                  />

                </div>

                <div />

              </div>

            </section>

            {/* DUGME */}

            <button
              type="submit"
              className="company-profile-submit"
              disabled={loading}
            >
              {loading
                ? 'Čuvanje...'
                : 'Sačuvaj promene'}
            </button>

          </form>

        </div>

      </div>
    </>
  );
}
