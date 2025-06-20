import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Circle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DealCard from '../../components/deals/DealCard';
import { DealStage, DealType } from '../../types';

const Deals: React.FC = () => {
  const { state } = useCrm();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DealType | 'all'>('all');
  
  // Filter deals based on filters
  const filteredDeals = state.deals.filter(deal => {
    // Apply stage filter
    if (stageFilter !== 'all' && deal.stage !== stageFilter) return false;
    
    // Apply type filter
    if (typeFilter !== 'all' && deal.type !== typeFilter) return false;
    
    // Apply search filter (search in related customer name)
    if (searchTerm) {
      const customer = state.customers.find(c => c.id === deal.customerId);
      if (!customer) return false;
      
      return customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Deals</h1>
        <Button 
          variant="primary" 
          icon={<PlusCircle size={16} />}
          onClick={() => {/* Add new deal logic */}}
        >
          New Deal
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as DealStage | 'all')}
            >
              <option value="all">All Stages</option>
              {Object.values(DealStage).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DealType | 'all')}
            >
              <option value="all">All Types</option>
              {Object.values(DealType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filteredDeals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No deals found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm || stageFilter !== 'all' || typeFilter !== 'all'
              ? "No deals match the current filters"
              : "You haven't created any deals yet"}
          </p>
          {!(searchTerm || stageFilter !== 'all' || typeFilter !== 'all') && (
            <div className="mt-6">
              <Button 
                variant="primary" 
                icon={<PlusCircle size={16} />}
                onClick={() => {/* Add new deal logic */}}
              >
                Create Your First Deal
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map(deal => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onClick={() => navigate(`/deals/${deal.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;