import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext';
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Calendar,
  FileSignature,
  Plus,
  Edit
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DealCard from '../../components/deals/DealCard';
import Badge from '../../components/common/Badge';

const DealershipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useCrm();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'activity'>('overview');

  // Find the dealership by ID
  const dealership = state.dealerships.find(d => d.id === id);
  
  // Find all deals for this dealership
  const dealershipDeals = state.deals.filter(deal => deal.dealershipId === id);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!dealership) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Dealership not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The dealership you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button 
            variant="primary" 
            onClick={() => navigate('/dealerships')}
          >
            Back to Dealerships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dealerships')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dealerships
        </button>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">{dealership.name}</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              icon={<FileSignature size={16} />}
              onClick={() => {/* New deal logic */}}
            >
              New Deal
            </Button>
            <Button 
              variant="primary" 
              icon={<Edit size={16} />}
              onClick={() => {/* Edit dealership logic */}}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-700" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{dealership.name}</h2>
                <p className="text-sm text-gray-500">Added on {formatDate(dealership.createdAt)}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-900">{dealership.address.street}</p>
                  <p className="text-gray-900">
                    {dealership.address.city}, {dealership.address.state} {dealership.address.zip}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Contact</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {dealership.primaryContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900">{dealership.primaryContact.name}</p>
                    <p className="text-sm text-gray-500">{dealership.primaryContact.position}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {dealership.primaryContact.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {dealership.primaryContact.email}
                  </div>
                </div>
              </div>
            </div>
            
            {dealership.specialPrograms.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Special Programs</h3>
                <div className="space-y-3">
                  {dealership.specialPrograms.map((program, index) => (
                    <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                      <p className="font-medium text-yellow-800">{program.name}</p>
                      <p className="text-sm text-yellow-700 mt-1">{program.description}</p>
                      {program.expirationDate && (
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-yellow-600" />
                          <span className="text-yellow-600">
                            Expires: {formatDate(program.expirationDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dealership.inventory && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
                  <a 
                    href={dealership.inventory} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Inventory
                  </a>
                </div>
                <p className="text-sm text-gray-500">View the dealership's current vehicle inventory</p>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6">
                <button
                  className={`pb-4 ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap font-medium text-sm`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`pb-4 ${
                    activeTab === 'deals'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap font-medium text-sm`}
                  onClick={() => setActiveTab('deals')}
                >
                  Deals ({dealershipDeals.length})
                </button>
                <button
                  className={`pb-4 ${
                    activeTab === 'activity'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap font-medium text-sm`}
                  onClick={() => setActiveTab('activity')}
                >
                  Activity
                </button>
              </nav>
            </div>

            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileSignature className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="font-medium text-blue-700">Deal Status</h4>
                    </div>
                    <p className="text-blue-800 font-semibold text-xl">
                      {dealershipDeals.length} Active Deal{dealershipDeals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium text-green-700">Partnership Status</h4>
                    </div>
                    <p className="text-green-800 font-semibold text-xl">Active</p>
                  </div>
                </div>

                {dealershipDeals.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Deals</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('deals')}
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {dealershipDeals.slice(0, 2).map(deal => (
                        <DealCard 
                          key={deal.id} 
                          deal={deal}
                          onClick={() => navigate(`/deals/${deal.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deals' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Dealership Deals</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => {/* New deal logic */}}
                  >
                    New Deal
                  </Button>
                </div>
                
                {dealershipDeals.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FileSignature className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No deals yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      This dealership doesn't have any deals yet
                    </p>
                    <div className="mt-6">
                      <Button 
                        variant="primary" 
                        icon={<Plus size={16} />}
                        onClick={() => {/* New deal logic */}}
                      >
                        Create First Deal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealershipDeals.map(deal => (
                      <DealCard 
                        key={deal.id} 
                        deal={deal}
                        onClick={() => navigate(`/deals/${deal.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => {/* Add note logic */}}
                  >
                    Add Note
                  </Button>
                </div>
                
                {dealership.activities.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There is no recorded activity for this dealership
                    </p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {dealership.activities
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((activity, activityIdx) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== dealership.activities.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                    <User className="h-4 w-4 text-white" />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {activity.description}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time>
                                      {formatDate(activity.createdAt)}
                                    </time>
                                    <div className="text-xs text-gray-400">
                                      {activity.createdBy}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealershipDetail;