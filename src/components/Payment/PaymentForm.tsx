import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import ApiService from '../../services/apiService';
import { API_STRIPE_INTENT, API_STRIPE_CONFIRM } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';

export default function PaymentForm({ selectedSeats, showtimeId, closePopup }: any) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                throw new Error("Card element not found.");
            }

            const { error: pmError, paymentMethod }: any = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (pmError) {
                throw new Error(pmError.message);
            }

            const intentResponse = await ApiService.post(API_STRIPE_INTENT, {
                data: { attributes: { selected_seats: selectedSeats, showtime_id: showtimeId }, payment_token: paymentMethod.id }
            });

            const { client_secret, booking_id: bookingId } = intentResponse.data;

            const { error, paymentIntent }: any = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: cardElement,
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                const response = await ApiService.put(API_STRIPE_CONFIRM, {
                    data: { payment_intent_id: paymentIntent.id, stripe_payment_id: paymentMethod.id }
                });

                navigate(`/bookings/${bookingId}/invoice?showtime_id=${showtimeId}`);
                closePopup();
                toast.success(`${response.data.notice}`)
            }
        } catch (error) {
          const err = error as any;
          if (err.response && err.response.data && err.response.data.error) {
            setMessage("An error occurred during payment confirmation.");
            toast.error(err.response.data.error);
          } else {
            setMessage("An unexpected error occurred during payment confirmation.");
            toast.error(`${err}`);
          }
        }

        setIsLoading(false);
    };

    const CARD_ELEMENT_OPTIONS = {
        style: {
          base: {
            color: "#32325d",
            margin: '10px 0 20px 0',
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
                    Card Details
                </label>
                <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
            </div>
            <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                disabled={isLoading || !stripe || !elements}
                id="submit"
            >
            <span id="button-text">
                {isLoading ? (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2" role="status"></div>
                ) : null}
                {isLoading ? 'Processing...' : 'Pay Now'}
            </span>
            </button>
            {message && <div className="mt-2 text-sm text-red-600" id="payment-message">{message}</div>}
        </form>
    );
}
