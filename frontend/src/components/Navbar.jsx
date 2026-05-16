import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Search, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Add Candidate', path: '/add', icon: UserPlus },
    { name: 'Match Requirements', path: '/match', icon: Search },
    { name: 'AI Shortlist', path: '/ai-shortlist', icon: Sparkles },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/candidates" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <Sparkles className="w-6 h-6" />
              <span>SmartRecruit</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={\`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors \${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }\`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={\`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium \${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }\`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
