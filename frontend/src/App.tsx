import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

/* ──────────────────────────────────────────────
   App Root — Router + Navigation
   Lazy-load pages to isolate import errors
   ────────────────────────────────────────────── */

const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ClinicPage = React.lazy(() => import('./pages/ClinicPage'));
const ScanPage = React.lazy(() => import('./pages/ScanPage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        {/* ── Navigation ──────────────────────── */}
        <nav className="nav">
          <div className="nav__brand">
            <span className="nav__logo">✚</span>
            <span className="nav__title">Matrix</span>
          </div>
          <ul className="nav__links">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/clinic" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/scan" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
                Scan QR
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ── Page Content ────────────────────── */}
        <React.Suspense fallback={<div className="dashboard-loading"><div className="spinner" /><p>Loading…</p></div>}>
          <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/clinic" element={<ClinicPage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
