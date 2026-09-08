import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { matchingApi } from '../../api_services/matching/MatchingApiService';

import type { MatchResult } from '../../models/matching/MatchResult';

import CandidateLayout from '../../components/candidate/CandidateLayout';

export default function MatchingJobsPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMatchingJobs() {
      try {
        const data = await matchingApi.getMatchingJobs();

        if (active) {
          setMatches(data);
        }
      } catch {
        if (active) {
          setError('Preporučeni oglasi se ne mogu učitati.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMatchingJobs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <CandidateLayout>
      <div className="grid min-h-[86vh] gap-6 rounded-2xl border border-solid border-[#dedde8] bg-white p-5 shadow-xl sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-0 border-b border-solid border-[#ebe9f1] pb-6">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-[#ef476f] sm:text-4xl">
              Poslovi za tebe
            </h1>

            <p className="m-0 mt-2 text-sm text-[#8c8c9a]">
              Preporuke prema željenim kategorijama i veštinama.
            </p>
          </div>

          <Link
            to="/candidate-profile"
            className="rounded-lg border border-solid border-[#f0c4d0] bg-[#fff3f6] px-4 py-3 text-sm font-semibold text-[#c8385c] no-underline hover:bg-[#fce5ec]"
          >
            Uredi profil
          </Link>
        </header>

        {loading && (
          <p className="m-0 py-10 text-center text-[#858592]">
            Učitavanje preporuka...
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

        {!loading && !error && (
          matches.length === 0 ? (
            <div className="grid justify-items-center gap-4 py-10 text-center">
              <h2 className="m-0 text-lg font-bold text-[#333344]">
                Trenutno nema preporuka
              </h2>

              <p className="m-0 max-w-xl text-sm leading-relaxed text-[#858592]">
                Dodajte veštine i željene kategorije poslova u profil.
                Preporuke se prikazuju kada postoje odgovarajući
                aktivni oglasi.
              </p>

              <Link
                to="/candidate-profile"
                className="rounded-lg bg-[#ef476f] px-5 py-3 font-semibold text-white no-underline hover:bg-[#df3d65]"
              >
                Dopuni profil
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((match) => (
                <article
                  key={match.jobId}
                  className="grid gap-4 rounded-xl border border-solid border-[#e3dfeb] border-l-4 border-l-[#24233d] bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 text-lg font-bold text-[#333344]">
                      {match.tittle}
                    </h2>

                    <span className="rounded-lg border border-solid border-[#f2ccd8] bg-[#fce8ee] px-3 py-2 text-sm font-bold text-[#c8385c]">
                      {match.matchPercentage.toLocaleString(
                        'sr-Latn-RS',
                        { maximumFractionDigits: 2 }
                      )}
                      % poklapanja
                    </span>
                  </div>

                  <p className="m-0 text-xs text-[#858592]">
                    {match.location} · {match.jobCategory}
                  </p>

                  <progress
                    max={100}
                    value={match.matchPercentage}
                    aria-label="Procenat poklapanja veština"
                    className="h-3 w-full accent-[#ef476f]"
                  />

                  <h3 className="m-0 text-sm font-bold text-[#333344]">
                    Veštine koje imate
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {match.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-solid border-[#d1e9d9] bg-[#e9f7ed] px-3 py-2 text-xs font-semibold text-[#2c7b48]"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  {match.missingSkills.length > 0 && (
                    <>
                      <h3 className="m-0 text-sm font-bold text-[#333344]">
                        Veštine koje nisu na vašem profilu
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {match.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-solid border-[#f3ccd7] bg-[#fff0f3] px-3 py-2 text-xs font-semibold text-[#b63255]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <Link
                    to={`/jobs/${match.jobId}`}
                    className="w-fit rounded-lg bg-[#ef476f] px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-[#df3d65]"
                  >
                    Pogledaj oglas
                  </Link>
                </article>
              ))}
            </div>
          )
        )}
      </div>
    </CandidateLayout>
  );
}