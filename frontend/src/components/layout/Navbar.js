import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, User, Menu, X, Bell, Home, 
  Building2, Star, Bookmark, LogOut 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Businesses', path: '/businesses', icon: <Building2 size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Menu size={20} /> },
    { name: 'About', path: '/about', icon: <Star size={20} /> },
  ];

  const userMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Saved Businesses', path: '/saved-businesses', icon: <Bookmark size={20} /> },
    { name: 'My Reviews', path: '/my-reviews', icon: <Star size={20} /> },
    { name: 'Business Dashboard', path: '/business/dashboard', icon: <Building2 size={20} /> },
    { name: 'Logout', action: handleLogout, icon: <LogOut size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">BizConnect</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>
           
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-blue-600">
                  <Bell size={22} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b">
                          <p className="font-semibold">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {user?.role}
                          </span>
                        </div>
                        {userMenu.map((item) => (
                          item.path ? (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              {item.icon}
                              <span className="ml-3">{item.name}</span>
                            </Link>
                          ) : (
                            <button
                              key={item.name}
                              onClick={item.action}
                              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition text-left"
                            >
                              {item.icon}
                              <span className="ml-3">{item.name}</span>
                            </button>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 px-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    {userMenu.map((item) => (
                      item.path ? (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center py-3 text-gray-700 hover:text-blue-600 transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      ) : (
                        <button
                          key={item.name}
                          onClick={() => {
                            item.action();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full py-3 text-gray-700 hover:text-blue-600 transition text-left"
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </button>
                      )
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-4 border-t border-gray-200 pt-4">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg font-medium mb-2 hover:bg-blue-50 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;