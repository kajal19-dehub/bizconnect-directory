import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, Star, MapPin, Phone, Clock,
  Filter, Search, Trash2, Share2, X,
  Grid, List, ChevronRight
} from 'lucide-react';
import api from '../../utils/api';

const SavedBusinesses = () => {
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const categories = ['Restaurant', 'Retail', 'Service', 'Health', 'Education', 'Entertainment'];

  useEffect(() => {
    fetchSavedBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [searchTerm, selectedCategories, savedBusinesses]);

  const fetchSavedBusinesses = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData = [
        {
          id: 1,
          name: 'The Coffee Corner',
          description: 'Cozy coffee shop with artisanal brews and pastries',
          category: 'Restaurant',
          rating: 4.8,
          reviews: 124,
          address: '123 Main St, New York, NY',
          phone: '+1 (555) 123-4567',
          hours: 'Open until 9 PM',
          distance: '0.5 mi',
          image: '/coffee-shop.jpg'
        },
        {
          id: 2,
          name: 'Tech Solutions Inc',
          description: 'Professional IT services and computer repair',
          category: 'Service',
          rating: 4.9,
          reviews: 89,
          address: '456 Tech Ave, San Francisco, CA',
          phone: '+1 (555) 987-6543',
          hours: 'Open until 6 PM',
          distance: '1.2 mi',
          image: '/tech-service.jpg'
        },
        {
          id: 3,
          name: 'GreenLeaf Spa',
          description: 'Luxury spa offering massage and wellness treatments',
          category: 'Health',
          rating: 4.7,
          reviews: 156,
          address: '789 Wellness Blvd, Los Angeles, CA',
          phone: '+1 (555) 456-7890',
          hours: 'Open until 8 PM',
          distance: '0.8 mi',
          image: '/spa.jpg'
        },
        {
          id: 4,
          name: 'BookWorm Café',
          description: 'Bookstore combined with coffee shop and reading lounge',
          category: 'Retail',
          rating: 4.6,
          reviews: 78,
          address: '321 Reading St, Chicago, IL',
          phone: '+1 (555) 321-6549',
          hours: 'Open until 10 PM',
          distance: '2.1 mi',
          image: '/bookstore.jpg'
        }
      ];
      
      setSavedBusinesses(mockData);
      setFilteredBusinesses(mockData);
    } catch (error) {
      console.error('Error fetching saved businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...savedBusinesses];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(business =>
        selectedCategories.includes(business.category)
      );
    }
    
    setFilteredBusinesses(filtered);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const removeBusiness = (id) => {
    setSavedBusinesses(prev => prev.filter(business => business.id !== id));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  const shareBusiness = (business) => {
    const url = `${window.location.origin}/business/${business.id}`;
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} on BizConnect!`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bookmark className="text-blue-600 mr-3" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Businesses</h1>
              <p className="text-gray-600 mt-2">
                {savedBusinesses.length} saved {savedBusinesses.length === 1 ? 'business' : 'businesses'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved businesses..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 ${
                    view === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 ${
                    view === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-4">
            <div className="flex items-center mb-3">
              <Filter size={18} className="text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredBusinesses.length} of {savedBusinesses.length} saved businesses
          </p>
          <div className="text-sm text-gray-500">
            {selectedCategories.length > 0 && (
              <span>
                Filtered by: {selectedCategories.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Saved Businesses List */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Bookmark size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No saved businesses found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategories.length > 0 
                ? 'Try adjusting your filters or search terms'
                : 'Start saving businesses to see them here'}
            </p>
            {searchTerm || selectedCategories.length > 0 ? (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/businesses"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
              >
                Explore Businesses
              </Link>
            )}
          </div>
        ) : view === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Business Image */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                  <button
                    onClick={() => removeBusiness(business.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      {business.category}
                    </span>
                  </div>
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{business.name}</h3>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      <Star size={14} className="mr-1" />
                      <span>{business.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{business.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span>{business.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      <span>{business.hours}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{business.distance} away</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => shareBusiness(business)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                      >
                        <Share2 size={20} />
                      </button>
                      <Link
                        to={`/business/${business.id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Business Image */}
                  <div className="relative md:w-48">
                    <div className="h-48 md:h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                    <button
                      onClick={() => removeBusiness(business.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Business Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                        <div className="flex items-center mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mr-3">
                            {business.category}
                          </span>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="font-medium">{business.rating}</span>
                            <span className="text-gray-500 ml-1">({business.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => shareBusiness(business)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6">{business.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <MapPin size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{business.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{business.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock size={18} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Hours</p>
                          <p className="font-medium">{business.hours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{business.distance} away</span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => removeBusiness(business.id)}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                        <Link
                          to={`/business/${business.id}`}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Visit Business
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {savedBusinesses.length === 0 && (
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Start Building Your Collection</h3>
              <p className="text-gray-600 mb-8">
                Save businesses you're interested in to easily find them later. 
                Create lists for different needs like "Date Night Spots" or "Weekend Activities".
              </p>
              <Link
                to="/businesses"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Bookmark size={20} className="mr-2" />
                Explore Businesses to Save
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBusinesses;