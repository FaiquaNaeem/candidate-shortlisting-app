import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Briefcase, Code2, Loader2, User } from 'lucide-react';

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/candidates`);
        setCandidates(response.data);
      } catch (err) {
        setError('Failed to load candidates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500">Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">No Candidates Found</h3>
        <p className="text-slate-500">There are no candidates in the system yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Candidate Directory</h1>
        <p className="text-slate-500 mt-2">View and manage all registered candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{candidate.name}</h3>
                  <div className="flex items-center text-slate-500 mt-1 text-sm">
                    <Mail className="w-4 h-4 mr-1.5" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-medium flex items-center whitespace-nowrap">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  {candidate.experience} Yrs
                </div>
              </div>
              
              {candidate.bio && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{candidate.bio}</p>
              )}

              <div className="mt-auto">
                <div className="flex items-center text-xs font-medium text-slate-500 mb-2">
                  <Code2 className="w-3.5 h-3.5 mr-1.5" />
                  SKILLS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 5 && (
                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                      +{candidate.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
              Added: {new Date(candidate.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatesList;
