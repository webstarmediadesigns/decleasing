import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext';
import { 
  ArrowLeft,
  FileText,
  Calendar, 
  Building2,
  Car,
  CreditCard,
  DollarSign,
  Clock,
  User,
  Plus,
  Edit,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { DealStage, DealType } from '../../types';
import TaskItem from '../../components/tasks/TaskItem';

const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useCrm();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'tasks'>('overview');
  const [showStageSelector, setShowStageSelector] = useState(false);

  // Find the deal by ID
  const deal = state.deals.find(d => d.id === id);
  
  // Find the customer for this deal
  const customer = deal ? state.customers.find(c => c.id === deal.customerId) : null;
  
  // Find the dealership for this deal
  const dealership = deal ? state.dealerships.find(d => d.id === deal.dealershipId) : null;
  
  // Find all tasks related to this deal
  const dealTasks = state.tasks.filter(
    task => task.relatedTo?.type === 'deal' && task.relatedTo.id === id
  );

  if (!deal || !customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Deal not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The deal you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button 
            variant="primary" 
            onClick={() => navigate('/deals')}
          >
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  // Function to get vehicle info based on deal type
  const getVehicleInfo = () => {
    switch (deal.type) {
      case DealType.Rental:
        return `${deal.rentalVehicleInfo.year} ${deal.rentalVehicleInfo.make} ${deal.rentalVehicleInfo.model}`;
      case DealType.Lease:
      case DealType.Finance:
        return `${deal.vehicleOfInterest.year} ${deal.vehicleOfInterest.make} ${deal.vehicleOfInterest.model}`;
      default:
        return 'Vehicle information not available';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle stage change
  const handleStageChange = (stage: DealStage) => {
    dispatch({
      type: 'UPDATE_DEAL_STAGE',
      payload: { dealId: deal.id, stage }
    });
    setShowStageSelector(false);
  };

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/deals')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Deals
        </button>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 mr-3">
                Deal #{deal.id.split('-')[1]}
              </h1>
              <StatusBadge stage={deal.stage} />
            </div>
            <p className="text-gray-500 mt-1">
              {getVehicleInfo()} - {deal.type}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              icon={<Plus size={16} />}
              onClick={() => {/* Add task logic */}}
            >
              Add Task
            </Button>
            <Button 
              variant="primary" 
              icon={<Edit size={16} />}
              onClick={() => {/* Edit deal logic */}}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="relative mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-blue-50 rounded-lg"
                onClick={() => setShowStageSelector(!showStageSelector)}
              >
                <div>
                  <p className="text-sm text-blue-700 font-medium">Current Stage</p>
                  <p className="text-lg font-semibold text-blue-900">{deal.stage}</p>
                </div>
                {showStageSelector ? (
                  <ChevronDown className="h-5 w-5 text-blue-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                )}
              </div>
              
              {showStageSelector && (
                <div className="mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 absolute z-10 w-full">
                  <p className="text-xs text-gray-500 mb-2 px-2">Select stage:</p>
                  {Object.values(DealStage).map((stage) => (
                    <button
                      key={stage}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                        deal.stage === stage
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleStageChange(stage)}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <button 
                      className="text-base font-medium text-gray-900 hover:text-blue-600"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      {customer.name}
                    </button>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
              </div>
              
              {dealership && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Dealership</h3>
                  <div className="flex items-center">
                    <Building2 className="h-10 w-10 text-blue-500 bg-blue-50 p-2 rounded-lg" />
                    <div className="ml-3">
                      <button 
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => navigate(`/dealerships/${dealership.id}`)}
                      >
                        {dealership.name}
                      </button>
                      <p className="text-sm text-gray-500">{dealership.primaryContact.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Timeline</h3>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Created</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatDate(deal.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Last Updated</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatDate(deal.updatedAt)}</span>
                </div>
              </div>

              {deal.type === DealType.Rental && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Rental Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Period</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(deal.rentalPeriod.start)} to {formatDate(deal.rentalPeriod.end)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${deal.rate.amount}/{deal.rate.period}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Insurance Requirements</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {deal.insuranceRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {deal.type === DealType.Lease && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Lease Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Term</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deal.leaseTerms.months} months / {deal.leaseTerms.miles.toLocaleString()} miles
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Credit Status</span>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        deal.creditApprovalStatus === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : deal.creditApprovalStatus === 'denied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {deal.creditApprovalStatus.charAt(0).toUpperCase() + deal.creditApprovalStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Loyalty Program</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deal.loyaltyProgramEligibility ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                  </div>
                  
                  {deal.incentives.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Incentives</h4>
                      <div className="space-y-2">
                        {deal.incentives.map((incentive, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900">{incentive.name}</span>
                              <span className="text-sm font-medium text-green-600">${incentive.amount}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{incentive.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {deal.type === DealType.Finance && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Finance Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Loan Term</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deal.loanTerm} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">APR</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deal.apr}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Down Payment</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${deal.downPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Trade-In Details</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        {deal.tradeInDetails.year} {deal.tradeInDetails.make} {deal.tradeInDetails.model}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">VIN: {deal.tradeInDetails.vin}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Estimated Value</p>
                          <p className="text-sm font-medium text-gray-900">
                            ${deal.tradeInDetails.estimatedValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payoff Amount</p>
                          <p className="text-sm font-medium text-gray-900">
                            ${deal.tradeInDetails.estimatedPayoff.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    activeTab === 'documents'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap font-medium text-sm`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents ({deal.documents.length})
                </button>
                <button
                  className={`pb-4 ${
                    activeTab === 'tasks'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap font-medium text-sm`}
                  onClick={() => setActiveTab('tasks')}
                >
                  Tasks ({dealTasks.length})
                </button>
                <button
  className={`pb-4 ${
    activeTab === 'settlements'
      ? 'border-b-2 border-blue-500 text-blue-600'
      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
  } whitespace-nowrap font-medium text-sm`}
  onClick={() => setActiveTab('settlements')}
>
  Settlements
</button>
              </nav>
            </div>

            {activeTab === 'overview' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  {deal.notes ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700 whitespace-pre-line">{deal.notes}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                      <p className="text-gray-500">No notes added yet</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        icon={<Plus size={16} />}
                        onClick={() => {/* Add note logic */}}
                      >
                        Add Note
                      </Button>
                    </div>
                  )}
                </div>

                {dealTasks.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('tasks')}
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {dealTasks.slice(0, 2).map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
                  {deal.activities.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        There is no recorded activity for this deal
                      </p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {deal.activities
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((activity, activityIdx) => (
                            <li key={activity.id}>
                              <div className="relative pb-8">
                                {activityIdx !== deal.activities.length - 1 ? (
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
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => {/* Upload document logic */}}
                  >
                    Upload Document
                  </Button>
                </div>
                
                {deal.documents.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload settlement documents, contracts, and other files
                    </p>
                    <div className="mt-6">
                      <Button 
                        variant="primary" 
                        icon={<Plus size={16} />}
                        onClick={() => {/* Upload document logic */}}
                      >
                        Upload First Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    {deal.documents.map((doc) => (
                      <div key={doc.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              <div className="flex space-x-4">
                                <p className="mt-1 text-xs text-gray-500">
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {doc.type}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {/* View document logic */}}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => {/* Add task logic */}}
                  >
                    Add Task
                  </Button>
                </div>
                
                {dealTasks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Create tasks to keep track of what needs to be done
                    </p>
                    <div className="mt-6">
                      <Button 
                        variant="primary" 
                        icon={<Plus size={16} />}
                        onClick={() => {/* Add task logic */}}
                      >
                        Create First Task
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'settlements' && (
  <SettlementSection dealId={deal.id} />
)}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;