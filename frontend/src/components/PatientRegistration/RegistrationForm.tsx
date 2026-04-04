import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Save, X } from 'lucide-react';
import { InputField, TextAreaField, SelectField } from '../ui/InputField';
import { Button } from '../ui/Button';

interface RegistrationFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function RegistrationForm({ onSubmit, onCancel, initialData }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    chiefComplaint: initialData?.chiefComplaint || '',
    vitals: initialData?.vitals || '',
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50"
    >
      <div className="flex items-center gap-2 mb-5">
        <UserPlus size={20} className="text-primary-600" />
        <h3 className="text-lg font-bold text-forest-900">Patient Registration</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
          <InputField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age in years"
          />
        </div>
        <SelectField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <TextAreaField
          label="Chief Complaint"
          name="chiefComplaint"
          value={formData.chiefComplaint}
          onChange={handleChange}
          placeholder="Describe symptoms, pain level, duration..."
          rows={3}
        />
        <TextAreaField
          label="Vitals (optional)"
          name="vitals"
          value={formData.vitals}
          onChange={handleChange}
          placeholder="BP, HR, Temp, SpO2..."
          rows={2}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            <Save size={16} className="mr-2" /> Save Patient
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              <X size={16} className="mr-2" /> Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}