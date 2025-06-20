import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Car, 
  CreditCard, 
  FileSignature,
  Clock,
  Plus,
  Edit
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Deal, CreditRating } from '../../types';
import DealCard from '../../components/deals/DealCard';
import TaskItem from '../../components/tasks/TaskItem';

const getCreditRatingBadgeVariant = (rating: CreditRating) => {
  switch (rating) {
    case CreditRating.Excellent:
      return 'success';
    case CreditRating.Good:
      return 'primary';
    case CreditRating.Fair:
      return 'warning';
    case CreditRating.Poor:
      return 'danger';
    default:
      return 'secondary';
  }
};

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useCrm();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'deals' | 'activity'>('overview');

  // Find the customer by ID
  const customer = state.customers.find(c => c.id === id);
  
  // Find all deals for this customer
  const customerDeals = state.deals.filter(deal => deal.customerId === id);
  
  // Find all tasks related to this customer
  const customerTasks = state.tasks.filter(
    task => task.relatedTo?.type === 'customer' && task.relatedTo.id === id
  );

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Customer not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The customer you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button 
            variant="primary" 
            onClick={() => navigate('/customers')}
          >
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/customers')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </button>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              icon={<Plus size={16} />}
              onClick={() => {/* Add task logic */}}
            >
              Add Task
            </Button>
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
              onClick={() => {/* Edit customer logic */}}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-800 text-2xl font-bold mb-2">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
              <div className="mt-2">
                <Badge variant={getCreditRatingBadgeVariant(customer.creditRating)}>
                  {customer.creditRating} Credit
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{customer.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-900">{customer.address.street}</p>
                  <p className="text-gray-900">
                    {customer.address.city}, {customer.address.state} {customer.address.zip}
                  </p>
                </div>
              </div>
            </div>

            {(customer.currentMonthlyPayment || customer.negativeEquityAmount) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
                <div className="space-y-4">
                  {customer.currentMonthlyPayment && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Monthly Payment</span>
                      <span className="font-semibold">${customer.currentMonthlyPayment}/mo</span>
                    </div>
                  )}
                  {customer.negativeEquityAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Negative Equity</span>
                      <span className="font-semibold">${customer.negativeEquityAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {customer.tradeInVehicle && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trade-In Vehicle</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {customer.tradeInVehicle.year} {customer.tradeInVehicle.make} {customer.tradeInVehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">VIN</span>
                    <span className="font-mono text-sm">{customer.tradeInVehicle.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Value</span>
                    <span className="font-semibold">${customer.tradeInVehicle.estimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Payoff</span>
                    <span className="font-semibold">${customer.tradeInVehicle.estimatedPayoff.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <div className="space-y-4">
                {Object.entries(customer.documents).map(([key, doc]) => 
                  doc && (
                    <div key={doc.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  )
                )}
                {Object.keys(customer.documents).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No documents uploaded</p>
                )}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth 
                    icon={<Plus size={16} />}
                    onClick={() => {/* Upload document logic */}}
                  >
                    Upload Document
                  </Button>
                </div>
              </div>
            </div>
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
                  Deals ({customerDeals.length})
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileSignature className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="font-medium text-blue-700">Deal Status</h4>
                    </div>
                    <p className="text-blue-800 font-semibold text-xl">
                      {customerDeals.length} Active Deal{customerDeals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium text-green-700">Credit Rating</h4>
                    </div>
                    <p className="text-green-800 font-semibold text-xl">{customer.creditRating}</p>
                  </div>
                </div>

                {customerTasks.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Upcoming Tasks</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={<Plus size={16} />}
                        onClick={() => {/* Add task logic */}}
                      >
                        Add Task
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {customerTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}

                {customerDeals.length > 0 && (
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
                      {customerDeals.slice(0, 2).map(deal => (
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
                  <h3 className="text-lg font-medium text-gray-900">Customer Deals</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => {/* New deal logic */}}
                  >
                    New Deal
                  </Button>
                </div>
                
                {customerDeals.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FileSignature className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No deals yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      This customer doesn't have any deals yet
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
                    {customerDeals.map(deal => (
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
                
                {customer.activities.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There is no recorded activity for this customer
                    </p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {customer.activities
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((activity, activityIdx) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== customer.activities.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                    {activity.type === 'note' && (
                                      <FileText className="h-4 w-4 text-white" />
                                    )}
                                    {activity.type === 'document' && (
                                      <FileText className="h-4 w-4 text-white" />
                                    )}
                                    {activity.type === 'status_change' && (
                                      <Edit className="h-4 w-4 text-white" />
                                    )}
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
                                      {new Date(activity.createdAt).toLocaleDateString()}
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

export default CustomerDetail;