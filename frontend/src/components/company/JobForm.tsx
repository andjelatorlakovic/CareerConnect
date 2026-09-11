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
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onSubmit: (data: JobFormData) => void;
}

export default function JobForm({
  initial = {},
  loading,
  submitLabel,
  title = 'Kreirajte novi oglas',
  subtitle = 'Unesite informacije o poziciji koju želite da ponudite',
  onBack,
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
      <div className="job-page !min-h-0 !bg-transparent !p-0">

        <div className="job-card !min-h-[86vh] !w-full !rounded-[28px] !border !border-solid !border-[#e3dfe8] !bg-[#f7f7fb] !p-4 !shadow-xl sm:!p-8">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-6 w-fit border-0 bg-transparent p-0 text-sm font-semibold text-[#c8385c] hover:underline"
            >
              ← Nazad
            </button>
          )}

          {/* NASLOV */}

          <div className="job-header !mb-8 !rounded-3xl !border-0 !bg-[#24233d] !p-6 sm:!p-8">

            <h1 className="!m-0 !text-3xl !font-bold !tracking-tight !text-white sm:!text-4xl">
              {title}
            </h1>

            <p className="!mb-0 !mt-2 !text-base !text-[#d3d1e0]">
              {subtitle}
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="job-form !mx-auto !grid !max-w-5xl !gap-6"
          >

            {/* NAZIV + LOKACIJA */}

            <div className="job-form-row !grid !grid-cols-1 !gap-5 md:!grid-cols-2">

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="title" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition placeholder:text-[#aaa8b4] hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                  required
                />

              </div>

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="location" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition placeholder:text-[#aaa8b4] hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                  required
                />

              </div>

            </div>

            {/* TIP ZAPOSLENJA + ISKUSTVO */}

            <div className="job-form-row !grid !grid-cols-1 !gap-5 md:!grid-cols-2">

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="employmentType" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
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

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="experienceLevel" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
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

            <div className="job-form-row !grid !grid-cols-1 !gap-5 md:!grid-cols-2">

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="jobCategory" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
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

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="expiresAt" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                  required
                />

              </div>

            </div>

            {/* PLATA */}

            <div className="job-form-row !grid !grid-cols-1 !gap-5 md:!grid-cols-2">

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="salaryMin" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition placeholder:text-[#aaa8b4] hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                />

              </div>

              <div className="job-form-group !grid !gap-2">

                <label htmlFor="salaryMax" className="text-sm font-semibold text-[#45445a]">
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
                  className="h-12 w-full rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 text-sm text-[#333344] outline-none transition placeholder:text-[#aaa8b4] hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                />

              </div>

            </div>

            {/* OPIS POSLA */}

            <div className="job-form-group !grid !gap-2">

              <label htmlFor="description" className="text-sm font-semibold text-[#45445a]">
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
                className="min-h-36 w-full resize-y rounded-xl border border-solid border-[#e2dfe9] bg-white px-4 py-3 text-sm leading-relaxed text-[#333344] outline-none transition placeholder:text-[#aaa8b4] hover:border-[#f3a0b5] focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/10"
                required
              />

            </div>

            {/* VEŠTINE */}

            <fieldset className="m-0 grid gap-4 rounded-2xl border border-solid border-[#e6e2eb] bg-white p-5">

              <legend className="px-1 text-sm font-semibold text-[#45445a]">
                Potrebne veštine
              </legend>

              <div className="job-skills !grid !grid-cols-2 !gap-3 sm:!grid-cols-3 lg:!grid-cols-4">

                {Object.values(Skill).map(
                  (skill) => (

                    <label
                      key={skill}
                      className="job-skill !flex !cursor-pointer !items-center !gap-2 !rounded-xl !border !border-solid !border-[#e2dfe9] !bg-[#fafafd] !px-3 !py-3 !text-sm !font-medium !text-[#555466] hover:!border-[#ef476f]"
                    >

                      <input
                        type="checkbox"
                        checked={form.skills.includes(
                          skill
                        )}
                        onChange={() =>
                          toggleSkill(skill)
                        }
                        className="size-4 accent-[#ef476f]"
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
              className="job-submit-button !justify-self-start !rounded-xl !border-0 !bg-[#ef476f] !px-6 !py-3 !font-bold !text-white hover:!bg-[#d9365f] disabled:!opacity-60"
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
