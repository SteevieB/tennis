// src/types/index.ts
export interface Booking {
    id: number;
    user_id: number;
    user_name?: string;
    court_id: number;
    date: string;
    start_time: string;
    end_time: string;
    type: 'regular' | 'tournament' | 'maintenance';
}

export interface User {
    id: number;
    name?: string;
    email?: string;
    isAdmin?: boolean;
}

export interface CourtBlock {
    id: number;
    court_id: number;
    start_date: string;
    end_date: string;
    reason: string;
}

export interface Settings {
    openingTime?: string;
    closingTime?: string;
    maintenanceDay?: string;
    maintenanceTime?: string;
    maxSimultaneousBookings?: number;
    advanceBookingPeriod?: number;
    maxBookingDuration?: number;
    autoCleanupDays?: number;
}