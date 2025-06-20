import React from 'react';
import { Customer, CreditRating } from '../../types';
import { Phone, Mail, MapPin, FileText } from 'lucide-react';
import Badge from '../common/Badge';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

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

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  const { name, email, phone, address, creditRating, documents } = customer;
  
  const documentCount = Object.values(documents).filter(Boolean).length;
  
  return (
    <div 
      className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <Badge variant={getCreditRatingBadgeVariant(creditRating)}>
          {creditRating}
        </Badge>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {phone}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          {email}
        </div>
        <div className="flex items-start text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
          <span>
            {address.street}, {address.city}, {address.state} {address.zip}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm text-gray-500">
            {documentCount} Document{documentCount !== 1 ? 's' : ''}
          </span>
        </div>
        {customer.tradeInVehicle && (
          <div className="text-sm text-gray-500">
            Trade-in: {customer.tradeInVehicle.year} {customer.tradeInVehicle.make}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;