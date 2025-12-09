import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu as MenuIcon, 
  X, 
  Mountain, 
  Home as HomeIcon,
  UtensilsCrossed,
  Image as ImageIcon,
  Phone,
  User,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FloatingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Treks', path: '/treks', icon: Mountain },
    { name: 'Food', path: '/food', icon: UtensilsCrossed },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Floating Navigation */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 hidden md:block ${
          scrolled ? 'top-2' : 'top-4'
        }`}
      >
        <div
          className={`flex items-center gap-1 px-6 py-3 rounded-full backdrop-blur-md bg-white/70 border border-white/20 shadow-lg transition-all duration-300 ${
            scrolled ? 'bg-white/80 shadow-xl' : ''
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold text-stone-900 mr-4 hover:text-emerald-600 transition-colors whitespace-nowrap"
          >
            Banjara Barracks
          </Link>

          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-700 hover:bg-white/50 hover:text-emerald-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* User Menu or Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 rounded-full hover:bg-white/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 backdrop-blur-md bg-white/95 border border-white/20"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              size="sm"
              className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
            >
              <User className="w-4 h-4 mr-1" />
              Login
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Floating Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 md:hidden">
        <div
          className={`flex items-center justify-between px-5 py-3 rounded-full backdrop-blur-md bg-white/70 border border-white/20 shadow-lg transition-all duration-300 ${
            scrolled ? 'bg-white/80 shadow-xl' : ''
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <Link to="/" className="text-lg font-bold text-stone-900 hover:text-emerald-600 transition-colors">
            Banjara Barracks
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-700 hover:text-emerald-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className="mt-3 rounded-2xl backdrop-blur-md bg-white/90 border border-white/20 shadow-xl overflow-hidden"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-stone-700 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* User Section */}
              <div className="border-t border-white/20 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-5 py-2">
                      <p className="text-xs text-stone-500 mb-1">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/my-orders');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-white/50 w-full"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/food');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 w-full"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default FloatingNav;
