import React, {  useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'test_key'
const stripeTestPromise = loadStripe(stripeKey);

function StripeContainer({ selectedSeats, showtimeId }: any) {
	const [showPopup, setShowPopup] = useState<boolean>(true);

	const appearance = {
		theme: "stripe",
	};
	const options: any = {
		appearance,
	};

	const closePopup = () => {
		setShowPopup(false);
	};

	return (
		<div className="flex justify-center items-center mb-8">
			<div className="App">
        {showPopup && (
					<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
						<div className="w-full bg-white p-8 max-w-lg rounded-lg shadow-lg relative">
							<button onClick={closePopup} className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">
								X
							</button>
							<Elements options={options} stripe={stripeTestPromise}>
								<PaymentForm selectedSeats={selectedSeats} showtimeId={showtimeId} closePopup={closePopup} />
							</Elements>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default StripeContainer;
