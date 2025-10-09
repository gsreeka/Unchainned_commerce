import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import useAdvertisements, { Advertisement } from '../hooks/useAdvertisements';
import Button from './Button';
import Loading from './Loading';

interface AdvertisementManagerProps {
  className?: string;
}

const AdvertisementManager: React.FC<AdvertisementManagerProps> = ({
  className = '',
}) => {
  const { advertisements, loading, error, refetch } = useAdvertisements({ 
    activeOnly: false 
  });
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleActive = (ad: Advertisement) => {
    console.log(`Toggling active status for ad: ${ad.id}`);
    refetch();
  };

  const handleEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setIsEditing(true);
  };

  const handleDelete = (ad: Advertisement) => {
    if (window.confirm(`Are you sure you want to delete "${ad.title}"?`)) {
      console.log(`Deleting ad: ${ad.id}`);
      refetch();
    }
  };

  const handleSave = (ad: Advertisement) => {
    console.log('Saving advertisement:', ad);
    setIsEditing(false);
    setSelectedAd(null);
    refetch();
  };

  if (loading) {
    return (
      <div className={`advertisement-manager ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`advertisement-manager ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading advertisements: {error.message}</p>
          <Button onClick={refetch} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`advertisement-manager ${className}`}>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Advertisement Management
            </h3>
            <Button
              onClick={() => {
                setSelectedAd(null);
                setIsEditing(true);
              }}
              className="inline-flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Advertisement
            </Button>
          </div>

          <div className="space-y-4">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {ad.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ad.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {ad.priority && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Priority: {ad.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(ad)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={ad.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {ad.isActive ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(ad)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {advertisements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No advertisements found</p>
              <Button
                onClick={() => {
                  setSelectedAd(null);
                  setIsEditing(true);
                }}
                className="mt-4"
              >
                Create your first advertisement
              </Button>
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {selectedAd ? 'Edit Advertisement' : 'Add Advertisement'}
            </h3>
            <p className="text-gray-600 mb-4">
              Advertisement editing form would go here. In a real application, 
              you would implement a proper form with validation.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  if (selectedAd) {
                    handleSave(selectedAd);
                  } else {
                    // Create new ad logic
                    setIsEditing(false);
                  }
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedAd(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementManager;
