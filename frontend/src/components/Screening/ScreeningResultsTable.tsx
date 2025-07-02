import React from 'react';
import { ScreeningResult } from '@/types/screening';

interface ScreeningResultsTableProps {
  results: ScreeningResult[];
}

const ScreeningResultsTable: React.FC<ScreeningResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="mt-8 alert alert-info">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Screening complete, but no matching candidates were found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Screening Report</h2>
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
          {/* We get the 'index' from the map function */}
          {results.map((result, index) => (
            // And use it to create a guaranteed unique key like "1-0", "1-1", etc.
            <tr key={`${result.candidateId}-${index}`} className="hover">
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
                <div className="flex flex-wrap gap-1 max-w-md">
                  {result.matchedKeywords.length > 0 ? (
                    // This inner key is fine as it's a separate list
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
  );
};

export default ScreeningResultsTable;