import React, { useRef, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { addFormEntry } from '../../store/formsSlice';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../../types';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter')
    .required('Name is required'),
  age: yup
    .number()
    .min(0, 'Age must be non-negative')
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
  const [errors, setErrors] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
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
        const errorMessages = error.inner.map((err) => err.message);
        setErrors(errorMessages);
      } else {
        setErrors([String(error)]);
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

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="text" autoComplete="name" />
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input id="age" name="age" type="number" autoComplete="off" />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" autoComplete="off">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="termsAccepted">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            autoComplete="off"
          />{' '}
          Accept Terms and Conditions
        </label>
      </div>

      <div>
        <label htmlFor="image">Upload Picture:</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg, image/png"
          autoComplete="off"
        />
        {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <CountryAutocomplete
          id="country"
          label="Country"
          value={country}
          onChange={setCountry}
        />
        {/* Hidden input to include the selected country in form submission */}
        <input type="hidden" name="country" value={country} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledForm;
