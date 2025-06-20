import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import CustomerCard from '../../components/customers/CustomerCard';

const Customers: React.FC = () => {
  const { state } = useCrm();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter customers based on search term
  const filteredCustomers = state.customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <Button 
          variant="primary" 
          icon={<PlusCircle size={16} />}
          onClick={() => {/* Add new customer form logic */}}
        >
          Add Customer
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              icon={<Filter size={16} />}
              onClick={() => {/* Filter logic */}}
            >
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm 
              ? `No customers match the search "${searchTerm}"`
              : "You haven't added any customers yet"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button 
                variant="primary" 
                icon={<PlusCircle size={16} />}
                onClick={() => {/* Add new customer form logic */}}
              >
                Add Your First Customer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              onClick={() => navigate(`/customers/${customer.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;