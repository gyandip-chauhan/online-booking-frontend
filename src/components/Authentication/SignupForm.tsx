import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_SIGNUP } from '../../services/apiEndpoints';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignupForm = ({ setUserData }: any) => {
  const initialValues = { email: '', password: '', confirmPassword: '' };
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const response = await ApiService.post(API_SIGNUP, { user: values });
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      setUserData(response.data.user);
      navigate('/showtimes');
      toast.success(`${response.data.notice}`);
    } catch (error) {
      setErrors({ apiError: 'Signup failed' });
      toast.error(`${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-black font-bold mb-4 text-center">Signup</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
              <ErrorMessage name="apiError" component="div" className="text-red-500 text-sm" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;
