import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ManageAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (availability: TimeSlot[]) => void;
  initialAvailability?: TimeSlot[];
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ManageAvailabilityModal: React.FC<ManageAvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAvailability = [],
}) => {
  const [availability, setAvailability] = useState<TimeSlot[]>(
    initialAvailability.length > 0
      ? initialAvailability
      : [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
  );

  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleAddTimeSlot = () => {
    setAvailability([
      ...availability,
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    };
    setAvailability(newAvailability);
  };

  const validateTimeSlots = () => {
    // Check for overlapping time slots on the same day
    for (let i = 0; i < availability.length; i++) {
      for (let j = i + 1; j < availability.length; j++) {
        if (
          availability[i].day === availability[j].day &&
          ((availability[i].startTime <= availability[j].startTime &&
            availability[i].endTime > availability[j].startTime) ||
            (availability[j].startTime <= availability[i].startTime &&
              availability[j].endTime > availability[i].startTime))
        ) {
          setError(`Overlapping time slots found for ${availability[i].day}`);
          return false;
        }
      }
    }

    // Check if end time is after start time
    for (const slot of availability) {
      if (slot.endTime <= slot.startTime) {
        setError(`End time must be after start time for ${slot.day}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateTimeSlots()) {
      onSave(availability);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Availability
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {availability.map((slot, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <select
                value={slot.day}
                onChange={(e) => handleChange(index, 'day', e.target.value)}
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />

              <span className="text-gray-500">to</span>

              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />

              <button
                onClick={() => handleRemoveTimeSlot(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 space-x-4 flex items-center">
          <button
            onClick={handleAddTimeSlot}
            className="flex items-center space-x-2 px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Time Slot</span>
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailabilityModal;
