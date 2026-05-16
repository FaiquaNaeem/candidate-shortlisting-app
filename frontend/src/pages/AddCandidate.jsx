import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Loader2 } from 'lucide-react';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
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
        ...formData,
        experience: Number(formData.experience)
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(\`\${apiUrl}/api/candidates\`, payload);
      navigate('/candidates');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Add New Candidate</h2>
              <p className="text-slate-500 text-sm mt-1">Enter the candidate's professional details below.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                required
                min="0"
                step="0.5"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                placeholder="3.5"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow resize-none"
                placeholder="Brief summary of professional background..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding Candidate...
                </>
              ) : (
                'Add Candidate'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
