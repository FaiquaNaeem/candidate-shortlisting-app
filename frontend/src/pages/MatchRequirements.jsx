import { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const MatchRequirements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: Number(formData.minExperience)
      };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/match`, payload);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch match results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Basic Match</h1>
        <p className="text-slate-500 mt-2">Find candidates matching your basic requirements using standard logic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              Criteria
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  required
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="React, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  name="minExperience"
                  required
                  min="0"
                  step="0.5"
                  value={formData.minExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Matches'}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {results && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-semibold text-slate-900">Results ({results.length})</h3>
              </div>
              
              {results.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                  No candidates found in the database.
                </div>
              ) : (
                results.map((candidate, idx) => (
                  <div key={candidate._id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-bold text-slate-900">{candidate.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            candidate.matchScore >= 80 ? 'bg-green-100 text-green-700' : 
                            candidate.matchScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {candidate.matchScore}% Match
                          </span>
                        </div>
                        <div className="text-slate-500 text-sm mt-1">{candidate.email}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium flex items-center gap-1.5 justify-end">
                          {candidate.experienceMet ? (
                            <span className="text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Exp: {candidate.experience}y (Met)</span>
                          ) : (
                            <span className="text-red-500 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Exp: {candidate.experience}y (Not Met)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Matched Skills</div>
                      {candidate.matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.matchedSkills.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">No exact skill matches.</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {!results && !loading && (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl h-full min-h-[300px] flex items-center justify-center p-8 text-center">
              <div className="text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Enter your requirements and click "Find Matches" to see results.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchRequirements;
