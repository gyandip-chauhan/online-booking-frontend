// src/components/ShowTime/types.ts
export interface Theater {
  attributes: {
    id: number;
    name: string;
    location: string;
  }
}

export interface Screen {
  attributes: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
}
export interface MovieCastAndCrew {
  attributes: {
    id: number;
    name: string;
    kind: string;
    role: string;
    movie_id: number;
    image_url: string;
  }
}

export interface Movie {
  attributes: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    movie_category_id: number;
    avatar_url: string;
    showtimes: {data: Showtime[]};
    theater: {data: Theater};
    casts: {data: MovieCastAndCrew[];};
    crews: {data: MovieCastAndCrew[];};
  }
}

export interface Showtime {
  attributes: {
    id: number;
    movie_id: number;
    theater_id: number;
    time: string;
    created_at: string;
    updated_at: string;
    screen_id: number;
    theater: {data: Theater}; 
    screen: {data: Screen};
    movie: {data: Movie};
  }
}

export interface Category {
  attributes: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    // movies: {data: Movie[]};
    showtimes: {data: Showtime[]};
  }
}

export interface User {
  id: number;
  email: string;
  token: string;
  created_at: string;
  updated_at: string;
  balance: number;
}

export interface PriceRange {
  value: string;
  label: string;
}

export interface ShowTimesResponse {
  data: {
    showtimes: {data: Showtime[]};
    movie: {data: Movie};
    price_ranges: PriceRange[];
    theaters: {data: Theater[];}
    screens: {data: Screen[];}
  }
}

export interface Booking {
  attributes: {
    id: number;
    showtime: {data: Showtime};
    showtime_id: number;
    booked_seats: {data: BookedSeat[]};
  }
}
export interface BookedSeat {
  attributes: {
    id: number;
    seats: string;
    seat_category: {data: SeatCategory};
  }
}

export interface SeatCategory {
  attributes: {
    id: number;
    name: string;
  }
}

export interface Notification {
  attributes: {
    id: number;
    message: string;
    read_at:string;
  }
}
