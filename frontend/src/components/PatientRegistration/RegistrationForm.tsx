import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import VoiceInput from './VoiceInput';
import { registerPatient } from '../../services/api';
import type { Patient, PatientRegistrationRequest, Gender } from '../../types/patient';

/* ──────────────────────────────────────────────
   Validation schema
   ────────────────────────────────────────────── */

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
});

type FormData = z.infer<typeof registrationSchema>;

/* ──────────────────────────────────────────────
   Registration Form – voice + manual input
   ────────────────────────────────────────────── */

interface RegistrationFormProps {
  onSuccess?: (patient: Patient) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complaint, setComplaint] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gender: 'MALE' as Gender,
    },
  });

  /* Keep complaint in sync with react-hook-form */
  const handleComplaintChange = (val: string) => {
    setComplaint(val);
    setValue('chiefComplaint', val, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: PatientRegistrationRequest = {
        ...data,
        email: data.email || undefined,
        address: data.address || undefined,
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactPhone: data.emergencyContactPhone || undefined,
      };
      const patient = await registerPatient(payload);
      reset();
      setComplaint('');
      onSuccess?.(patient);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="reg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="reg-form__title">Patient Registration</h2>

      {error && <div className="reg-form__error">{error}</div>}

      {/* ── Name Row ────────────────────────── */}
      <div className="reg-form__row">
        <div className="reg-form__field">
          <label htmlFor="firstName">First Name *</label>
          <input id="firstName" {...register('firstName')} placeholder="John" />
          {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
        </div>
        <div className="reg-form__field">
          <label htmlFor="lastName">Last Name *</label>
          <input id="lastName" {...register('lastName')} placeholder="Doe" />
          {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
        </div>
      </div>

      {/* ── DOB + Gender ────────────────────── */}
      <div className="reg-form__row">
        <div className="reg-form__field">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
          {errors.dateOfBirth && <span className="field-error">{errors.dateOfBirth.message}</span>}
        </div>
        <div className="reg-form__field">
          <label htmlFor="gender">Gender *</label>
          <select id="gender" {...register('gender')}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && <span className="field-error">{errors.gender.message}</span>}
        </div>
      </div>

      {/* ── Contact ─────────────────────────── */}
      <div className="reg-form__row">
        <div className="reg-form__field">
          <label htmlFor="phone">Phone *</label>
          <input id="phone" type="tel" {...register('phone')} placeholder="+1 555‑123‑4567" />
          {errors.phone && <span className="field-error">{errors.phone.message}</span>}
        </div>
        <div className="reg-form__field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} placeholder="john@example.com" />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>
      </div>

      {/* ── Address ─────────────────────────── */}
      <div className="reg-form__field">
        <label htmlFor="address">Address</label>
        <input id="address" {...register('address')} placeholder="123 Main St, City" />
      </div>

      {/* ── Emergency Contact ───────────────── */}
      <div className="reg-form__row">
        <div className="reg-form__field">
          <label htmlFor="emergencyContactName">Emergency Contact</label>
          <input id="emergencyContactName" {...register('emergencyContactName')} placeholder="Jane Doe" />
        </div>
        <div className="reg-form__field">
          <label htmlFor="emergencyContactPhone">Emergency Phone</label>
          <input id="emergencyContactPhone" type="tel" {...register('emergencyContactPhone')} placeholder="+1 555‑987‑6543" />
        </div>
      </div>

      {/* ── Chief Complaint (with voice) ───── */}
      <VoiceInput
        label="Chief Complaint *"
        value={complaint}
        onChange={handleComplaintChange}
        placeholder="Describe the primary symptoms (you can use voice input)…"
      />
      {errors.chiefComplaint && <span className="field-error">{errors.chiefComplaint.message}</span>}

      {/* ── Submit ──────────────────────────── */}
      <button
        type="submit"
        className="reg-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering…' : 'Register Patient'}
      </button>
    </form>
  );
};

export default RegistrationForm;
