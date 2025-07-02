import React from 'react';
import { ScreeningResult } from '@/types/screening';

interface ScreeningResultsModalProps {
  isLoading: boolean;
  error: string | null;
  results: ScreeningResult[];
  onClose: () => void;
}

const ScreeningResultsModal: React.FC<ScreeningResultsModalProps> = ({ isLoading, error, results, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-lg">Screening Results</h3>
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

        <div className="py-4">
          {isLoading && (
            <div className="text-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4">Screening resumes, this may take a moment...</p>
            </div>
          )}

          {error && !isLoading && <div className="alert alert-error">{error}</div>}

          {!isLoading && !error && results.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Candidate Email</th>
                    <th>Match Score</th>
                    <th>Matched Keywords</th>
                  </tr>
                </thead>
                <tbody>
                  {/* --- FIX IS HERE --- */}
                  {/* We now get the 'index' from the map function */}
                  {results.map((result, index) => (
                    // And use it to create a guaranteed unique key
                    <tr key={`${result.candidateId}-${index}`}>
                      <td className="font-medium">{result.candidateEmail}</td>
                      <td>
                        <span className={`badge ${
                          result.score > 75 ? 'badge-success' :
                          result.score > 40 ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {result.score.toFixed(2)}%
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {/* This inner key is also fine, as it's scoped to its own list */}
                          {result.matchedKeywords.length > 0 ? (
                            result.matchedKeywords.map((keyword, kwIndex) => (
                              <span key={kwIndex} className="badge badge-outline badge-sm">
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic">None</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
             <div className="alert alert-info">Screening complete. No candidates matched the criteria.</div>
          )}
        </div>
        
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ScreeningResultsModal;