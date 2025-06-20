import React, { useState } from 'react';
import { CustomerIncentiveType, CustomerIncentive } from '../../types';
import { Plus, Check, X, FileText } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

interface CustomerIncentivesProps {
  incentives: CustomerIncentive[];
  onAdd: (type: CustomerIncentiveType) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
  onUploadDocument: (id: string, file: File) => Promise<void>;
}

const CustomerIncentives: React.FC<CustomerIncentivesProps> = ({
  incentives,
  onAdd,
  onRemove,
  onVerify,
  onUploadDocument,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<CustomerIncentiveType | ''>('');

  const availableTypes = Object.values(CustomerIncentiveType).filter(
    type => !incentives.some(incentive => incentive.type === type)
  );

  const handleAdd = async () => {
    if (selectedType) {
      await onAdd(selectedType as CustomerIncentiveType);
      setSelectedType('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Incentives</h3>
        {!isAdding && availableTypes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsAdding(true)}
          >
            Add Incentive
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CustomerIncentiveType)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select incentive type...</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!selectedType}
            >
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {incentives.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No incentives added yet</p>
      ) : (
        <div className="space-y-3">
          {incentives.map((incentive) => (
            <div
              key={incentive.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{incentive.type}</h4>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge
                      variant={incentive.verified ? 'success' : 'warning'}
                    >
                      {incentive.verified ? 'Verified' : 'Pending Verification'}
                    </Badge>
                    {incentive.verificationDate && (
                      <span className="text-xs text-gray-500">
                        Verified on {new Date(incentive.verificationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!incentive.verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Check size={16} />}
                      onClick={() => onVerify(incentive.id)}
                    >
                      Verify
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<X size={16} />}
                    onClick={() => onRemove(incentive.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {incentive.documents && incentive.documents.length > 0 ? (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                  <div className="space-y-2">
                    {incentive.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{doc.name}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <input
                    type="file"
                    className="hidden"
                    id={`document-${incentive.id}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onUploadDocument(incentive.id, file);
                      }
                    }}
                  />
                  <label
                    htmlFor={`document-${incentive.id}`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Plus size={16} className="mr-1" />
                    Add verification document
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerIncentives;