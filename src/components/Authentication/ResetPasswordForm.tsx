import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_RESET_PASSWORD } from '../../services/apiEndpoints';

const ResetPasswordForm = () => {
  const initialValues = { password: '', confirmPassword: '' };

  const validationSchema = Yup.object({
    password: Yup.string().required('Required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const response = await ApiService.post(API_RESET_PASSWORD, { user: values });
      // Handle successful password reset
    } catch (error) {
      setErrors({ apiError: 'Reset failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block">New Password</label>
            <Field type="password" name="password" className="w-full px-4 py-2 border rounded-md" />
            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>
          <div>
            <label className="block">Confirm New Password</label>
            <Field type="password" name="confirmPassword" className="w-full px-4 py-2 border rounded-md" />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600">
            Reset Password
          </button>
          <ErrorMessage name="apiError" component="div" className="text-red-500" />
        </Form>
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
