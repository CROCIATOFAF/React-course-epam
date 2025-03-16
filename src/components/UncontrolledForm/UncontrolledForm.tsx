import React, { useRef, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { addFormEntry } from '../../store/formsSlice';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../../types';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import styles from './UncontrolledForm.module.css';

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter')
    .required('Name is required'),
  age: yup
    .number()
    .min(14, 'Age must be at least 14')
    .max(100, 'Age must be at most 100')
    .required('Age is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must contain one number, one uppercase, one lowercase and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms'),
  country: yup.string().required('Country is required'),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const UncontrolledForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');

  const validateForm = async (): Promise<void> => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('country', country);
    const data = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      termsAccepted: formData.get('termsAccepted') === 'on',
      country: formData.get('country') as string,
    };
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errorsByField = err.inner.reduce(
          (acc: Record<string, string>, error) => {
            if (error.path) {
              acc[error.path] = error.message;
            }
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(errorsByField);
      }
    }
  };

  const handleFieldChange = (field: string) => async () => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    await validateForm();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setImageError(null);
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('country', country);

    const file = formData.get('image') as File | null;
    let base64Image = '';
    if (file && file.size > 0) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setImageError('Only JPEG and PNG files are allowed');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setImageError('File size should be less than 2MB');
        return;
      }
      base64Image = await convertToBase64(file);
    }

    const data = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      termsAccepted: formData.get('termsAccepted') === 'on',
      country: formData.get('country') as string,
      image: base64Image,
    };

    try {
      await schema.validate(data, { abortEarly: false });
      const entry: FormData = { ...data, id: Date.now().toString() };
      dispatch(addFormEntry(entry));
      navigate('/', { state: { newEntryId: entry.id } });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorsByField = error.inner.reduce(
          (acc: Record<string, string>, err) => {
            if (err.path) {
              acc[err.path] = err.message;
            }
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(errorsByField);
      } else {
        setErrors({ form: String(error) });
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const isSubmitDisabled: boolean =
    Object.values(errors).some((msg) => msg.trim() !== '') ||
    imageError !== null;

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className={styles.fieldContainer}>
        <label htmlFor="name" className={styles.label}>
          Name:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={styles.inputField}
            onChange={handleFieldChange('name')}
          />
          <p className={styles.errorMessage}>{errors.name || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="age" className={styles.label}>
          Age:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="age"
            name="age"
            type="number"
            autoComplete="off"
            className={styles.inputField}
            onChange={handleFieldChange('age')}
          />
          <p className={styles.errorMessage}>{errors.age || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={styles.inputField}
            onChange={handleFieldChange('email')}
          />
          <p className={styles.errorMessage}>{errors.email || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="password" className={styles.label}>
          Password:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={styles.inputField}
            onChange={handleFieldChange('password')}
          />
          <p className={styles.errorMessage}>{errors.password || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={styles.inputField}
            onChange={handleFieldChange('confirmPassword')}
          />
          <p className={styles.errorMessage}>{errors.confirmPassword || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="gender" className={styles.label}>
          Gender:
        </label>
        <div className={styles.inputContainer}>
          <select
            id="gender"
            name="gender"
            autoComplete="off"
            className={styles.inputField}
            onChange={handleFieldChange('gender')}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <p className={styles.errorMessage}>{errors.gender || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="termsAccepted" className={styles.label}>
          Terms:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            autoComplete="off"
            className={styles.inputField}
            onChange={handleFieldChange('termsAccepted')}
          />
          <p className={styles.errorMessage}>{errors.termsAccepted || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="country" className={styles.label}>
          Country:
        </label>
        <div className={styles.inputContainer}>
          <CountryAutocomplete
            id="country"
            label="Country"
            value={country}
            onChange={(val: string) => {
              setCountry(val);
              setErrors((prev) => ({ ...prev, country: '' }));
            }}
          />
          <p className={styles.errorMessage}>{errors.country || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="image" className={styles.label}>
          Upload Picture:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg, image/png"
            autoComplete="off"
            className={styles.inputField}
          />
          <p className={styles.errorMessage}>{imageError || ' '}</p>
        </div>
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        Submit
      </button>
    </form>
  );
};

export default UncontrolledForm;
