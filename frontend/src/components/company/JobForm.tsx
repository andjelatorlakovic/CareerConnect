import { useState } from 'react';

import {
  EmploymentType,
  type EmploymentType as EmploymentTypeValue,
} from '../../models/jobs/EmploymentType';

import {
  ExperienceLevel,
  type ExperienceLevel as ExperienceLevelValue,
} from '../../models/jobs/ExperienceLevel';

import {
  JobCategory,
  type JobCategory as JobCategoryValue,
} from '../../models/jobs/JobCategory';

import {
  Skill,
  type Skill as SkillValue,
} from '../../models/jobs/Skill';

import type { JobFormData } from '../../types/jobs/JobFormData';

interface JobFormProps {
  initial?: Partial<JobFormData>;
  loading: boolean;
  submitLabel: string;
  onSubmit: (data: JobFormData) => void;
}

export default function JobForm({
  initial = {},
  loading,
  submitLabel,
  onSubmit,
}: JobFormProps) {
  const [form, setForm] = useState<JobFormData>({
    title: initial.title ?? '',
    description: initial.description ?? '',
    location: initial.location ?? '',

    experienceLevel:
      initial.experienceLevel ?? ExperienceLevel.Junior,

    jobCategory:
      initial.jobCategory ?? JobCategory.SoftwareDevelopment,

    employmentType:
      initial.employmentType ?? EmploymentType.FullTime,

    expiresAt:
      initial.expiresAt?.slice(0, 10) ?? '',

    skills:
      initial.skills ?? [],

    salaryMin:
      initial.salaryMin ?? '',

    salaryMax:
      initial.salaryMax ?? '',
  });

  const toggleSkill = (skill: SkillValue) => {
    setForm((previous) => ({
      ...previous,

      skills: previous.skills.includes(skill)
        ? previous.skills.filter(
            (item) => item !== skill
          )
        : [...previous.skills, skill],
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
        .job-page {
          width: 100%;
          min-height: 100vh;

          box-sizing: border-box;

          padding: 0.7%;

          background: #19182d;
        }

        .job-card {
          width: 99.6%;
          min-height: 98.6vh;

          margin: 0 auto;

          background: #ffffff;

          border-radius: 18px;

          padding: 2.5% 3.5% 3.5%;

          box-sizing: border-box;

          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.25);
        }

        /* NASLOV */

        .job-header {
          text-align: center;

          margin-bottom: 2.5%;

          padding: 1% 2% 2%;

          border-bottom: 1px solid #eeeef3;
        }

        .job-header h1 {
          margin: 0;

          font-size: clamp(
            30px,
            3vw,
            44px
          );

          font-weight: 700;

          color: #ef476f;

          letter-spacing: -1.5px;
        }

        .job-header p {
          margin: 0.7% 0 0;

          font-size: clamp(
            14px,
            1.2vw,
            17px
          );

          color: #8c8c9a;
        }

        /* FORMA */

        .job-form {
          display: flex;

          flex-direction: column;

          gap: 1.3vw;

          width: 100%;
        }

        .job-form-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 2.2%;

          width: 100%;
        }

        .job-form-group {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          gap: 8px;

          width: 100%;
        }

        .job-form-group label {
          display: block;

          width: 100%;

          text-align: left;

          font-size: clamp(
            13px,
            1vw,
            15px
          );

          font-weight: 600;

          color: #333344;
        }

        /* INPUTI */

        .job-form input:not(
          [type="checkbox"]
        ),
        .job-form textarea,
        .job-form select {
          width: 100%;

          box-sizing: border-box;

          border: 1px solid #d9d9e2;

          border-radius: 9px;

          background: #fafafd;

          font-size: clamp(
            14px,
            1vw,
            16px
          );

          color: #333344;

          outline: none;

          transition: all 0.2s ease;
        }

        .job-form input:not(
          [type="checkbox"]
        ),
        .job-form select {
          height: 3vw;

          min-height: 45px;

          padding: 0 1.2%;
        }

        .job-form textarea {
          min-height: 8vw;

          padding: 15px;

          resize: vertical;

          font-family: inherit;
        }

        .job-form input::placeholder,
        .job-form textarea::placeholder {
          color: #a6a6b2;
        }

        .job-form input:focus,
        .job-form textarea:focus,
        .job-form select:focus {
          border-color: #ef476f;

          background: #ffffff;

          box-shadow:
            0 0 0 3px
            rgba(239, 71, 111, 0.12);
        }

        .job-form select {
          cursor: pointer;
        }

        /* VEŠTINE */

        .job-form fieldset {
          width: 100%;

          box-sizing: border-box;

          margin: 0;

          padding: 1.4% 1.7%;

          border: 1px solid #d9d9e2;

          border-radius: 10px;

          background: #fafafd;
        }

        .job-form legend {
          padding: 0 1%;

          font-size: clamp(
            13px,
            1vw,
            15px
          );

          font-weight: 600;

          color: #333344;
        }

        .job-skills {
          display: grid;

          grid-template-columns:
            repeat(6, 1fr);

          gap: 0.8vw 2%;

          margin-top: 0.4%;
        }

        .job-skill {
          display: flex !important;

          flex-direction: row !important;

          align-items: center;

          gap: 8px;

          width: auto !important;

          font-size: clamp(
            13px,
            1vw,
            15px
          ) !important;

          font-weight: 400 !important;

          color: #555566 !important;

          cursor: pointer;
        }

        /* CHECKBOX */

        .job-skill input[type="checkbox"] {
          appearance: none;

          -webkit-appearance: none;

          width: 18px !important;
          height: 18px !important;

          min-width: 18px !important;
          min-height: 18px !important;

          margin: 0;

          padding: 0;

          background: #ffffff;

          border: 1.5px solid #cfcfd9;

          border-radius: 4px;

          cursor: pointer;

          position: relative;

          transition: all 0.15s ease;
        }

        /* KADA JE ČEKIRAN */

        .job-skill input[type="checkbox"]:checked {
          background: #ef476f;

          border-color: #ef476f;
        }

        /* ŠTIKLICA */

        .job-skill input[type="checkbox"]:checked::after {
          content: "";

          position: absolute;

          left: 5px;
          top: 2px;

          width: 5px;
          height: 9px;

          border: solid #ffffff;

          border-width: 0 2px 2px 0;

          transform: rotate(45deg);
        }

        .job-skill input[type="checkbox"]:hover {
          border-color: #ef476f;
        }

        /* DUGME */

        .job-submit-button {
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

        .job-submit-button:hover:not(:disabled) {
          background: #df3d65;

          transform: translateY(-1px);

          box-shadow:
            0 6px 15px
            rgba(239, 71, 111, 0.25);
        }

        .job-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .job-submit-button:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }

        /* MANJI EKRANI */

        @media (max-width: 700px) {
          .job-page {
            padding: 0.5%;
          }

          .job-card {
            width: 99.5%;

            padding: 5% 4%;
          }

          .job-form-row {
            grid-template-columns: 1fr;

            gap: 20px;
          }

          .job-skills {
            grid-template-columns:
              repeat(3, 1fr);
          }
        }

        /* TELEFON */

        @media (max-width: 450px) {
          .job-page {
            padding: 0;
          }

          .job-card {
            width: 100%;

            border-radius: 12px;

            padding: 7% 5%;
          }

          .job-skills {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="job-page">

        <div className="job-card">

          {/* NASLOV */}

          <div className="job-header">

            <h1>
              Kreirajte novi oglas
            </h1>

            <p>
              Unesite informacije o poziciji koju želite da ponudite
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="job-form"
          >

            {/* NAZIV + LOKACIJA */}

            <div className="job-form-row">

              <div className="job-form-group">

                <label htmlFor="title">
                  Naziv pozicije
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  placeholder="Npr. Software Developer"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="job-form-group">

                <label htmlFor="location">
                  Lokacija
                </label>

                <input
                  id="location"
                  type="text"
                  value={form.location}
                  placeholder="Npr. Novi Sad"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      location: event.target.value,
                    })
                  }
                  required
                />

              </div>

            </div>

            {/* TIP ZAPOSLENJA + ISKUSTVO */}

            <div className="job-form-row">

              <div className="job-form-group">

                <label htmlFor="employmentType">
                  Tip zaposlenja
                </label>

                <select
                  id="employmentType"
                  value={form.employmentType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      employmentType:
                        event.target.value as EmploymentTypeValue,
                    })
                  }
                >

                  {Object.values(
                    EmploymentType
                  ).map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

              </div>

              <div className="job-form-group">

                <label htmlFor="experienceLevel">
                  Nivo iskustva
                </label>

                <select
                  id="experienceLevel"
                  value={form.experienceLevel}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      experienceLevel:
                        event.target.value as ExperienceLevelValue,
                    })
                  }
                >

                  {Object.values(
                    ExperienceLevel
                  ).map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* KATEGORIJA + DATUM */}

            <div className="job-form-row">

              <div className="job-form-group">

                <label htmlFor="jobCategory">
                  Kategorija posla
                </label>

                <select
                  id="jobCategory"
                  value={form.jobCategory}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      jobCategory:
                        event.target.value as JobCategoryValue,
                    })
                  }
                >

                  {Object.values(
                    JobCategory
                  ).map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

              </div>

              <div className="job-form-group">

                <label htmlFor="expiresAt">
                  Datum isteka
                </label>

                <input
                  id="expiresAt"
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      expiresAt:
                        event.target.value,
                    })
                  }
                  required
                />

              </div>

            </div>

            {/* PLATA */}

            <div className="job-form-row">

              <div className="job-form-group">

                <label htmlFor="salaryMin">
                  Minimalna plata
                </label>

                <input
                  id="salaryMin"
                  type="number"
                  placeholder="Npr. 1000"
                  value={form.salaryMin}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      salaryMin:
                        event.target.value,
                    })
                  }
                />

              </div>

              <div className="job-form-group">

                <label htmlFor="salaryMax">
                  Maksimalna plata
                </label>

                <input
                  id="salaryMax"
                  type="number"
                  placeholder="Npr. 2000"
                  value={form.salaryMax}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      salaryMax:
                        event.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* OPIS POSLA */}

            <div className="job-form-group">

              <label htmlFor="description">
                Opis posla
              </label>

              <textarea
                id="description"
                value={form.description}
                placeholder="Unesite opis posla, odgovornosti i očekivanja..."
                onChange={(event) =>
                  setForm({
                    ...form,
                    description:
                      event.target.value,
                  })
                }
                rows={6}
                required
              />

            </div>

            {/* VEŠTINE */}

            <fieldset>

              <legend>
                Potrebne veštine
              </legend>

              <div className="job-skills">

                {Object.values(Skill).map(
                  (skill) => (

                    <label
                      key={skill}
                      className="job-skill"
                    >

                      <input
                        type="checkbox"
                        checked={form.skills.includes(
                          skill
                        )}
                        onChange={() =>
                          toggleSkill(skill)
                        }
                      />

                      <span>
                        {skill}
                      </span>

                    </label>

                  )
                )}

              </div>

            </fieldset>

            {/* DUGME */}

            <button
              type="submit"
              className="job-submit-button"
              disabled={loading}
            >
              {loading
                ? 'Čuvanje...'
                : submitLabel}
            </button>

          </form>

        </div>

      </div>
    </>
  );
}
