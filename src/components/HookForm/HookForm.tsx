import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addFormEntry } from '../../store/formsSlice';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import type { FormData } from '../../types';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const schema = yup
  .object({
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
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain one number, one uppercase, one lowercase and one special character'
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    gender: yup.string().required('Gender is required'),
    termsAccepted: yup
      .boolean()
      .oneOf([true], 'You must accept the terms')
      .required('You must accept the terms'),
    country: yup.string().required('Country is required'),
    image: yup
      .mixed<FileList>()
      .transform((value, originalValue) =>
        originalValue instanceof FileList
          ? originalValue
          : new DataTransfer().files
      )
      .default(new DataTransfer().files)
      .required(),
  })
  .required();

type FormValues = {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  country: string;
  image: FileList;
};

const HookForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(schema),
    mode: 'onChange',
    defaultValues: {
      termsAccepted: false,
      image: new DataTransfer().files,
      country: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setImageError(null);
    let base64Image = '';
    if (data.image.length > 0) {
      const file = data.image[0];
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

    const entry: FormData = {
      id: Date.now().toString(),
      name: data.name,
      age: data.age,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      gender: data.gender,
      termsAccepted: data.termsAccepted,
      country: data.country,
      image: base64Image,
    };

    dispatch(addFormEntry(entry));
    navigate('/', { state: { newEntryId: entry.id } });
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" {...register('name')} />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <p style={{ color: 'red' }}>{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" {...register('email')} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p style={{ color: 'red' }}>{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender">Gender:</label>
        <select id="gender" {...register('gender')}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p style={{ color: 'red' }}>{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="termsAccepted">
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted')}
          />{' '}
          Accept Terms and Conditions
        </label>
        {errors.termsAccepted && (
          <p style={{ color: 'red' }}>{errors.termsAccepted.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              id="country"
              label="Country"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.country && (
          <p style={{ color: 'red' }}>{errors.country.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="image">Upload Picture:</label>
        <input
          id="image"
          type="file"
          {...register('image')}
          accept="image/jpeg, image/png"
        />
        {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export default HookForm;
