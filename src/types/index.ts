// src/types/index.ts
export interface Booking {
    id: number;
    user_id: number;
    user_name?: string;
    start_time: string;
    end_time: string;
    type: 'regular' | 'tournament' | 'maintenance';
}

export interface User {
    id: number;
    isAdmin?: boolean;
}