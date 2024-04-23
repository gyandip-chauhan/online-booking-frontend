// src/services/apiEndpoints.tsx
export const API_LOGIN = '/users/login';
export const API_SIGNUP = '/users/signup';
export const API_LOGOUT = '/users/logout';
export const API_FORGOT_PASSWORD = '/users/forgot_password';
export const API_RESET_PASSWORD = '/users/reset_password';
export const API_RESEND_CONFIRMATION_EMAIL = '/users/resend_confirmation_email';

export const API_SHOWTIMES = (movieId: string, selectedDate: string, selectedPriceRange: string, selectedTheater: string, selectedScreen: string) => `/showtimes?movie_id=${movieId}&date=${selectedDate}&price_range=${selectedPriceRange}&theater_id=${selectedTheater}&screen_id=${selectedScreen}`;
export const API_SHOWTIME_DETAILS = (id: string, theater_id: string, screen_id: string, movie_id: string) => `/showtimes/${id}?theater_id=${theater_id}&screen_id=${screen_id}&movie_id=${movie_id}`;

export const API_BOOK_NOW = (showtimeId: string) => `/showtimes/${showtimeId}/book_now`;
export const API_INVOICE = (id: string, showtimeId: string) => `/bookings/${id}/invoice?showtime_id=${showtimeId}`;

export const API_STRIPE_INTENT = '/stripe_payments';
export const API_STRIPE_CONFIRM = '/stripe_payments/confirm';

export const API_BOOKINGS = '/bookings';
export const API_CANCEL_BOOKING = (id: number) => `/bookings/${id}/cancel`;

export const API_MOVIES = '/movies';
export const API_MOVIE_DETAILS = (id: string) => `/movies/${id}`;
