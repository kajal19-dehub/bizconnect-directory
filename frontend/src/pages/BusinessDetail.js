import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Globe, Star, Clock, 
  Facebook, Twitter, Instagram, Linkedin, Share2,
  Heart, CheckCircle, ChevronRight, Users, Award
} from 'lucide-react';
import api from '../utils/api';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { useSelector } from 'react-redux';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/businesses/${id}`);
      setBusiness(response.data.business);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    if (!isAuthenticated) {
      alert('Please login to save businesses');
      return;
    }
    try {
      await api.post(`/users/save-business/${id}`);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.businessName,
        text: `Check out ${business.businessName} on BizConnect!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    
    // Update business rating
    setBusiness(prev => ({
      ...prev,
      averageRating: ((prev.averageRating * prev.totalReviews) + newReview.rating) / (prev.totalReviews + 1),
      totalReviews: prev.totalReviews + 1
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Business not found</h2>
        <Link to="/businesses" className="text-blue-600 hover:text-blue-700">
          ← Back to Businesses
        </Link>
      </div>
    );
  }

  const workingHours = business.hours || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Business Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Business Logo/Image */}
            <div className="lg:w-1/4">
              <div className="relative">
                <img
                  src={business.logo?.url || business.images?.[0]?.url || '/default-business.png'}
                  alt={business.businessName}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
                {business.isVerified && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                    <CheckCircle size={16} className="mr-1" />
                    Verified
                  </div>
                )}
                {business.isFeatured && (
                  <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleSaveBusiness}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                    isSaved 
                      ? 'bg-red-100 text-red-600 border border-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} className={`mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-2 px-4 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center"
                >
                  <Share2 size={20} className="mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="lg:w-3/4">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{business.businessName}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < Math.floor(business.averageRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold">
                        {business.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({business.totalReviews} reviews)
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {business.category}
                    </span>
                  </div>
                </div>
                
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              <p className="text-gray-600 text-lg mb-6">{business.description}</p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin size={20} className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">
                        {business.address?.street}<br />
                        {business.address?.city}, {business.address?.state} {business.address?.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-blue-600 hover:text-blue-700">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail size={20} className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href={`mailto:${business.email}`} className="text-blue-600 hover:text-blue-700">
                        {business.email}
                      </a>
                    </div>
                  </div>
                  {business.website && (
                    <div className="flex items-center">
                      <Globe size={20} className="text-gray-400 mr-3" />
                      <div>
                        <p className="font-semibold">Website</p>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              {business.socialMedia && (
                <div className="mb-6">
                  <p className="font-semibold mb-2">Follow Us</p>
                  <div className="flex space-x-4">
                    {business.socialMedia.facebook && (
                      <a 
                        href={business.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Facebook size={24} />
                      </a>
                    )}
                    {business.socialMedia.twitter && (
                      <a 
                        href={business.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400"
                      >
                        <Twitter size={24} />
                      </a>
                    )}
                    {business.socialMedia.instagram && (
                      <a 
                        href={business.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600"
                      >
                        <Instagram size={24} />
                      </a>
                    )}
                    {business.socialMedia.linkedin && (
                      <a 
                        href={business.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700"
                      >
                        <Linkedin size={24} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex border-b overflow-x-auto">
          {['overview', 'services', 'reviews', 'photos', 'hours'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">About {business.businessName}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{business.description}</p>
                
                {business.services && business.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">Popular Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {business.services.slice(0, 4).map((service, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.price && (
                              <span className="font-bold text-blue-600">
                                ${service.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Users className="mx-auto mb-2 text-blue-600" size={24} />
                    <div className="text-2xl font-bold">{business.totalReviews}+</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Award className="mx-auto mb-2 text-green-600" size={24} />
                    <div className="text-2xl font-bold">{business.averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <CheckCircle className="mx-auto mb-2 text-yellow-600" size={24} />
                    <div className="text-2xl font-bold">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Star className="mx-auto mb-2 text-purple-600" size={24} />
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && business.services && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Our Services</h2>
                <div className="space-y-4">
                  {business.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                          <p className="text-gray-600">{service.description}</p>
                        </div>
                        {service.price && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ${service.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">per service</div>
                          </div>
                        )}
                      </div>
                      <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                        Book Now <ChevronRight size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {showReviewForm ? (
                  <ReviewForm 
                    businessId={id} 
                    onReviewSubmitted={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : (
                  <div className="mb-6">
                    {isAuthenticated ? (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Write a Review
                      </button>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-yellow-800">
                          Please <Link to="/login" className="font-semibold underline">login</Link> to write a review
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <ReviewList reviews={reviews} />
              </div>
            )}

            {activeTab === 'photos' && business.images && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Photos</h2>
                {business.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {business.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${business.businessName} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(image.url, '_blank')}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No photos available</p>
                )}
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
                <div className="space-y-3">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <Clock size={20} className="text-gray-400 mr-3" />
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                      {hours.open && hours.close ? (
                        <span className="font-semibold">
                          {hours.open} - {hours.close}
                        </span>
                      ) : (
                        <span className="text-red-500">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg mb-4 relative">
                {/* Map would go here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin size={48} className="text-red-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin size={20} className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-semibold">{business.address?.city}, {business.address?.state}</p>
                    <p className="text-gray-600 text-sm">{business.address?.street}</p>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.businessName + ' ' + business.address?.street + ' ' + business.address?.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Contact Business</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center justify-center bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition"
                >
                  <Phone size={20} className="mr-2" />
                  Call Now
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center justify-center bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition"
                >
                  <Mail size={20} className="mr-2" />
                  Send Email
                </a>
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-purple-100 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-200 transition"
                  >
                    <Globe size={20} className="mr-2" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Similar Businesses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Similar Businesses</h3>
              <div className="space-y-4">
                {/* This would be populated with API data */}
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <img
                    src="/default-business.png"
                    alt="Similar Business"
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <div>
                    <p className="font-semibold">Business Name</p>
                    <div className="flex items-center text-sm">
                      <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span>4.5</span>
                      <span className="text-gray-500 ml-1">(120 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;