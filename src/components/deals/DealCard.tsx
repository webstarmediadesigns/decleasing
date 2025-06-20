import React from 'react';
import { Deal, DealType } from '../../types';
import { Calendar, Briefcase, Car } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { useCrm } from '../../context/CrmContext';

interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const { state } = useCrm();

  // Find the customer for this deal
  const customer = state.customers.find(c => c.id === deal.customerId);
  const dealership = state.dealerships.find(d => d.id === deal.dealershipId);
  
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

  return (
    <div 
      className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-gray-500 text-sm mb-1">Deal #{deal.id.split('-')[1]}</div>
          <h3 className="text-lg font-medium text-gray-900">
            {customer ? customer.name : 'Unknown Customer'}
          </h3>
        </div>
        <StatusBadge stage={deal.stage} />
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <Car className="h-4 w-4 mr-2 text-gray-400" />
          {getVehicleInfo()}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
          {dealership ? dealership.name : 'Unknown Dealership'}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {formatDate(deal.createdAt)}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-2">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${deal.type === DealType.Lease ? 'bg-blue-100 text-blue-800' : 
              deal.type === DealType.Finance ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'}
          `}>
            {deal.type}
          </span>
          
          {deal.documents.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {deal.documents.length} Docs
            </span>
          )}
        </div>
        
        {deal.type === DealType.Lease && deal.leaseTerms && (
          <div className="text-sm text-gray-600">
            {deal.leaseTerms.months} mo / {deal.leaseTerms.miles.toLocaleString()} mi
          </div>
        )}
        
        {deal.type === DealType.Finance && (
          <div className="text-sm text-gray-600">
            {deal.loanTerm} mo @ {deal.apr}%
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;