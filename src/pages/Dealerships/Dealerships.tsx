import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Building2, Phone, Mail, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Dealerships: React.FC = () => {
  const { state } = useCrm();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter dealerships based on search term
  const filteredDealerships = state.dealerships.filter(dealership => 
    dealership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealership.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Dealerships</h1>
        <Button 
          variant="primary" 
          icon={<PlusCircle size={16} />}
          onClick={() => {/* Add new dealership logic */}}
        >
          Add Dealership
        </Button>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search dealerships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {filteredDealerships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No dealerships found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm 
              ? `No dealerships match the search "${searchTerm}"`
              : "You haven't added any dealerships yet"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button 
                variant="primary" 
                icon={<PlusCircle size={16} />}
                onClick={() => {/* Add new dealership logic */}}
              >
                Add Your First Dealership
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDealerships.map(dealership => (
            <Card 
              key={dealership.id}
              className="cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => navigate(`/dealerships/${dealership.id}`)}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{dealership.name}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {dealership.address.city}, {dealership.address.state}
                      </span>
                    </div>
                    
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
                
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-xs">
                      {dealership.primaryContact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">{dealership.primaryContact.name}</p>
                      <p className="text-xs text-gray-500">{dealership.primaryContact.position}</p>
                    </div>
                  </div>
                </div>
                
                {dealership.specialPrograms.length > 0 && (
                  <div className="mt-4 bg-yellow-50 p-2 rounded-md">
                    <p className="text-xs font-semibold text-yellow-800">Special Program:</p>
                    <p className="text-sm text-yellow-800">{dealership.specialPrograms[0].name}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dealerships;