import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Trophy, ArrowRight } from 'lucide-react';

const AIShortlist = () => {
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
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/ai/shortlist`, payload);
      setResults(response.data);
    } catch (err) {
      setError('Failed to generate AI shortlist. Ensure your backend has a valid OpenRouter API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI Shortlist
        </h1>
        <p className="text-slate-500 mt-2">Leverage GPT-4o to analyze candidates' bios, exact experience, and holistic skill match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Job Requirements</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-1">Required Skills</label>
                <input
                  type="text"
                  name="requiredSkills"
                  required
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                  placeholder="React, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-900 mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  name="minExperience"
                  required
                  min="0"
                  step="0.5"
                  value={formData.minExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                  placeholder="3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 mt-4 shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Shortlist
                  </>
                )}
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
          {loading && (
             <div className="bg-white rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center border border-slate-200">
               <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
               <h3 className="text-lg font-medium text-slate-900">AI is analyzing candidates...</h3>
               <p className="text-slate-500 mt-2">This usually takes 5-10 seconds depending on the number of candidates.</p>
             </div>
          )}

          {results && !loading && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-semibold text-slate-900">AI Rankings</h3>
              </div>
              
              {results.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                  No candidates found to analyze.
                </div>
              ) : (
                results.map((candidate) => (
                  <div key={candidate._id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${candidate.rank === 1 ? 'bg-yellow-400' : candidate.rank === 2 ? 'bg-slate-300' : candidate.rank === 3 ? 'bg-amber-600' : 'bg-purple-300'}`}></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pl-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-bold text-slate-900">{candidate.name}</h4>
                          <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                            <Trophy className={`w-3.5 h-3.5 ${candidate.rank === 1 ? 'text-yellow-500' : candidate.rank === 2 ? 'text-slate-400' : candidate.rank === 3 ? 'text-amber-600' : 'text-slate-400'}`} />
                            Rank #{candidate.rank}
                          </span>
                        </div>
                        <div className="text-slate-500 text-sm mt-1">{candidate.experience} years exp • {candidate.skills.slice(0,3).join(', ')}{candidate.skills.length > 3 ? '...' : ''}</div>
                      </div>
                      
                      <div className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-lg text-sm font-bold flex flex-col items-center shrink-0">
                        <span className="text-xs font-medium text-purple-500 uppercase tracking-wide">Match Score</span>
                        <span className="text-xl">{candidate.matchScore}%</span>
                      </div>
                    </div>

                    <div className="mt-3 pl-3">
                      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100 flex gap-3">
                        <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <p>{candidate.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {!results && !loading && (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl h-full min-h-[300px] flex items-center justify-center p-8 text-center">
              <div className="text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Ready to see the magic? Enter your requirements.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIShortlist;
