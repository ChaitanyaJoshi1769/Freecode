import { Code2, BookOpen, CheckCircle2, Bookmark, User, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { path: '/problems', label: 'Problems', icon: BookOpen },
    { path: '/submissions', label: 'Submissions', icon: CheckCircle2 },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Freecode</span>
          </Link>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
