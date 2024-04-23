import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_LOGIN } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';

const LoginForm = ({ setUserData }: any) => {
  const initialValues = { email: '', password: '' };
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await ApiService.post(API_LOGIN, { user: values });
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      setUserData(response.data.user);
      navigate('/movies');
      toast.success(`${response.data.notice}`);
    } catch (error) {
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  type="email"
                  name="email"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                  placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                  focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                  placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                  focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                  text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>
              {/* Add links below the form */}
              <div className="text-center mt-4">
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot your password?
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
