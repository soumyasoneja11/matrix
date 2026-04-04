import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: ER Triage System */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-3">ER Triage System</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              AI-powered emergency room triage management platform. Streamline patient intake,
              prioritize critical cases, and optimize resource allocation in real-time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Patient Triage
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/resource-allocation"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Resource Allocation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analytics"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Analytics
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
              Information
            </h4>
            <ul className="space-y-2">
              <li className="text-white/50 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Version 1.0
              </li>
              <li className="text-white/50 text-sm">Healthcare Management System</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} ER Triage System — VITALPASS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
