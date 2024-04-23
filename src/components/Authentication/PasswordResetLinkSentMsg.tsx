import React from "react";
import ApiService from '../../services/apiService';
import { API_FORGOT_PASSWORD } from '../../services/apiEndpoints';
import { toast } from "react-toastify";

interface Props {
  email: string;
}

const PasswordResetLinkSentMsg = ({ email }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  const resendPasswordResetLink = async (email: string) => {
    if (email?.trim()) {
      setIsLoading(true); // Set loading to true when resending link
      try {
        const response = await ApiService.post(API_FORGOT_PASSWORD, { user: {email: email} });
        toast.success(`${response.data.notice}`);
      } catch (error) {
        const err = error as any;
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error(`${err}`);
        }
      } finally {
        setIsLoading(false); // Set loading to false after API call completes
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-0 md:pt-36">
      <div className="mx-auto w-full md:w-5/12 lg:w-352 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-center text-3xl font-extrabold text-purple-900">
          Password reset link sent
        </h1>
        <div className="pt-6">
          <p className="text-center text-gray-700">
            A password reset link has been sent to your email ID:
            <span className="font-semibold">{email}</span>
          </p>
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          Didn’t receive the reset link?
          <button
            className={`ml-1 ${isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
            onClick={() => resendPasswordResetLink(email)}
            disabled={isLoading} // Disable button when loading
          >
            <span id="button-text">
              {isLoading ? (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2" role="status"></div>
              ) : null}
              {isLoading ? 'Processing...' : 'Resend'}
            </span>
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordResetLinkSentMsg;
