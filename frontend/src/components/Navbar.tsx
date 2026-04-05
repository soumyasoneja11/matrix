import { NavLink } from 'react-router-dom';
import {
  FaUserInjured,
  FaBed,
  FaUsers,
  FaUserCog,
  FaClipboardList,
  FaChartLine,
} from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

const navItems = [
  { path: '/triage', icon: FaUserInjured, label: 'Patient Triage' },
  { path: '/resource-allocation', icon: FaBed, label: 'Resource Allocation' },
  { path: '/staff-directory', icon: FaUsers, label: 'Staff Directory' },
  { path: '/staff-management', icon: FaUserCog, label: 'Staff Management' },
  { path: '/my-worklist', icon: FaClipboardList, label: 'My Worklist' },
  { path: '/analytics', icon: FaChartLine, label: 'Analytics' },
];

const Navbar = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="flex justify-center px-4 mt-3 mb-1">
      <nav
        id="collapsed-navbar"
        className={`
          flex items-center gap-1 px-2 py-1.5 rounded-2xl
          backdrop-blur-sm
          ${isLight
            ? 'bg-white/70 border border-[#e8e2d9] shadow-md'
            : 'bg-white/5 border border-white/10 shadow-lg shadow-black/10'
          }
        `}
        style={{ maxWidth: '100%', overflowX: 'auto' }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            id={`navbar-link-${item.path.replace('/', '')}`}
          >
            {({ isActive }) => (
              <span
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] font-medium
                  whitespace-nowrap cursor-pointer transition-all duration-200
                  ${isActive
                    ? 'bg-[#247B7B] text-white shadow-sm'
                    : isLight
                      ? 'text-[#6b7e7e] hover:bg-[#247B7B]/8 hover:text-[#247B7B]'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }
                `}
                style={isActive ? { fontWeight: 600 } : undefined}
              >
                <item.icon className="text-sm flex-shrink-0" />
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;