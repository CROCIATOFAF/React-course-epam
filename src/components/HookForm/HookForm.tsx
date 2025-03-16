import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addFormEntry } from '../../store/formsSlice';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import type { FormData } from '../../types';
import styles from './HookForm.module.css';

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
      <div className={styles.fieldContainer}>
        <label htmlFor="name" className={styles.label}>
          Name:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="name"
            {...register('name')}
            className={styles.inputField}
            autoComplete="name"
          />
          <p className={styles.errorMessage}>{errors.name?.message || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="age" className={styles.label}>
          Age:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className={styles.inputField}
            autoComplete="off"
          />
          <p className={styles.errorMessage}>{errors.age?.message || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="email"
            {...register('email')}
            className={styles.inputField}
            autoComplete="email"
          />
          <p className={styles.errorMessage}>{errors.email?.message || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="password" className={styles.label}>
          Password:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={styles.inputField}
            autoComplete="new-password"
          />
          <p className={styles.errorMessage}>
            {errors.password?.message || ' '}
          </p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={styles.inputField}
            autoComplete="new-password"
          />
          <p className={styles.errorMessage}>
            {errors.confirmPassword?.message || ' '}
          </p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="gender" className={styles.label}>
          Gender:
        </label>
        <div className={styles.inputContainer}>
          <select
            id="gender"
            {...register('gender')}
            className={styles.inputField}
            autoComplete="off"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <p className={styles.errorMessage}>{errors.gender?.message || ' '}</p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="termsAccepted" className={styles.label}>
          Terms:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted')}
            className={styles.inputField}
            autoComplete="off"
          />
          <p className={styles.errorMessage}>
            {errors.termsAccepted?.message || ' '}
          </p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="country" className={styles.label}>
          Country:
        </label>
        <div className={styles.inputContainer}>
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
          <p className={styles.errorMessage}>
            {errors.country?.message || ' '}
          </p>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label htmlFor="image" className={styles.label}>
          Upload Picture:
        </label>
        <div className={styles.inputContainer}>
          <input
            id="image"
            type="file"
            {...register('image')}
            className={styles.inputField}
            accept="image/jpeg, image/png"
            autoComplete="off"
          />
          <p className={styles.errorMessage}>{imageError || ' '}</p>
        </div>
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export default HookForm;
