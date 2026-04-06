import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer className={`mt-12 border-t ${isLight ? 'border-[#d8e8e4] bg-gradient-to-b from-[#247B7B]/15 to-white' : 'border-white/10 bg-white/[0.03] backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: ER Triage System */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>ER Triage System</h3>
            <p className="theme-text-muted text-sm leading-relaxed">
              AI-powered emergency room triage management platform. Streamline patient intake,
              prioritize critical cases, and optimize resource allocation in real-time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-[#3d5555]' : 'text-white/80'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Patient Triage
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/resource-allocation"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Resource Allocation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analytics"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Analytics
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-[#3d5555]' : 'text-white/80'}`}>
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors duration-200 ${isLight ? 'text-[#6b7e7e] hover:text-[#247B7B]' : 'text-white/50 hover:text-primary-400'}`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-[#3d5555]' : 'text-white/80'}`}>
              Information
            </h4>
            <ul className="space-y-2">
              <li className={`text-sm flex items-center gap-2 ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Version 1.0
              </li>
              <li className={`text-sm ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>Healthcare Management System</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-8 pt-6 border-t text-center ${isLight ? 'border-[#e8e2d9]' : 'border-white/5'}`}>
          <p className={`text-xs ${isLight ? 'text-[#b0bfbf]' : 'text-white/30'}`}>
            © {new Date().getFullYear()} ER Triage System — VITALPASS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
