import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Grid, List } from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import api from '../utils/api';

const BusinessList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minRating: '',
    sortBy: 'rating',
    view: 'grid',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);
  const [categories] = useState([
    'Restaurant', 'Retail', 'Service', 'Health', 'Education', 'Entertainment', 'Other'
  ]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    
    queryParams.forEach((value, key) => {
      if (key in newFilters) {
        newFilters[key] = value;
      }
    });

    setFilters(newFilters);
    fetchBusinesses(newFilters);
  }, [location.search]);

  const fetchBusinesses = async (filterParams) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(filterParams).toString();
      const response = await api.get(`/businesses?${queryString}`);
      setBusinesses(response.data.businesses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (filterParams) => {
    const params = new URLSearchParams();
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      city: '',
      minRating: '',
      sortBy: 'rating',
      page: 1
    };
    setFilters(defaultFilters);
    navigate('/businesses');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Local Businesses</h1>
        <p className="text-gray-600">
          Discover the best businesses in your area with detailed reviews and ratings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Business name or service"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="City or ZIP"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500" size={20} />
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleFilterChange('view', 'grid')}
                  className={`flex-1 py-2 flex justify-center ${
                    filters.view === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => handleFilterChange('view', 'list')}
                  className={`flex-1 py-2 flex justify-center ${
                    filters.view === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Business Listings */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16">
              <Filter size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No businesses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {businesses.length} of {totalPages * filters.limit} results
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Page {filters.page} of {totalPages}</span>
                </div>
              </div>

              {/* Business Grid/List View */}
              <div className={
                filters.view === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-6'
              }>
                {businesses.map((business) => (
                  <BusinessCard 
                    key={business._id} 
                    business={business} 
                    view={filters.view}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (filters.page <= 3) {
                        pageNum = i + 1;
                      } else if (filters.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = filters.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-lg ${
                            filters.page === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessList;