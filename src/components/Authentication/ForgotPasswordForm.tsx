import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_FORGOT_PASSWORD } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';
import PasswordResetLinkSentMsg from './PasswordResetLinkSentMsg';

const ForgotPasswordForm = () => {
  const [emailToSendResetPasswordLink, setEmailToSendResetPasswordLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    setEmailToSendResetPasswordLink("");
  }, []);
  
  const initialValues = { email: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    setIsLoading(true); // Set loading to true when submitting form
    const email = values?.email?.trim();
    try {
      const response = await ApiService.post(API_FORGOT_PASSWORD, { user: values });
      setEmailToSendResetPasswordLink(email);
      toast.success(`${response.data.notice}`);
    } catch (error) {
      setErrors({ apiError: 'Request failed' });
      const err = error as any;
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(`${err}`);
      }
    } finally {
      setIsLoading(false); // Set loading to false after API call completes
      setSubmitting(false);
    }
  };

  if (emailToSendResetPasswordLink) {
    return <PasswordResetLinkSentMsg email={emailToSendResetPasswordLink} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
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
                {/* Display loader or button based on isLoading */}
                <button
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
                  text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300`}
                  disabled={isSubmitting || isLoading}
                >
                  <span id="button-text">
                    {isLoading ? (
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2" role="status"></div>
                    ) : null}
                    {isLoading ? 'Processing...' : 'Send password reset link'}
                  </span>
                </button>
              </div>
              {/* Add links below the form */}
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-800">
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

export default ForgotPasswordForm;
