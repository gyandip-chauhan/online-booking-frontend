import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ApiService from '../../services/apiService';
import { API_RESEND_CONFIRMATION_EMAIL } from '../../services/apiEndpoints';

const ResendConfirmationForm = () => {
  const initialValues = { email: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const response = await ApiService.post(API_RESEND_CONFIRMATION_EMAIL, { user: values });
      // Handle successful resend confirmation request
    } catch (error) {
      setErrors({ apiError: 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Resend Confirmation Email</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block">Email</label>
            <Field type="email" name="email" className="w-full px-4 py-2 border rounded-md" />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600">
            Resend Confirmation Email
          </button>
          <ErrorMessage name="apiError" component="div" className="text-red-500" />
        </Form>
      </Formik>
    </div>
  );
};

export default ResendConfirmationForm;