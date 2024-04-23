import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_RESET_PASSWORD } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get('reset_token');
  const initialValues = { reset_password_token: resetToken, password: '', password_confirmation: '' };
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    password: Yup.string().required('Required').min(6, 'Password must be at least 6 characters'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const response = await ApiService.put(API_RESET_PASSWORD, { user: values });
      navigate('/login')
      toast.success(`${response.data.notice}`);
    } catch (error) {
      setErrors({ apiError: 'Reset failed' });
      const err = error as any;
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(`${err}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  type="password"
                  name="password"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                  placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                  focus:z-10 sm:text-sm"
                  placeholder="New Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password_confirmation"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                  placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                  focus:z-10 sm:text-sm"
                  placeholder="Confirm New Password"
                />
                <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                  text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  Reset Password
                </button>
              </div>
              <div className="text-center">
                <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
