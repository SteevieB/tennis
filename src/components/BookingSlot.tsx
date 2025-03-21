import React from 'react';
import { X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BookingSlot = ({
                         slot,
                         booking,
                         isBooked,
                         currentUser,
                         onBook,
                         onCancel,
                         canCancel
                     }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState('regular');

    const isOwnBooking = booking && booking.user_id === currentUser?.id;
    const bookingType = booking?.type || 'regular';

    const handleBook = () => {
        if (currentUser?.isAdmin) {
            setIsOpen(true);
        } else {
            onBook(slot, 'regular');
        }
    };

    const handleConfirmBooking = () => {
        onBook(slot, selectedType);
        setIsOpen(false);
    };

    const getSlotStyle = () => {
        if (!isBooked) {
            return 'bg-green-500 hover:bg-green-600 text-white';
        }
        if (bookingType === 'maintenance') {
            return 'bg-orange-500 text-white';
        }
        if (bookingType === 'tournament') {
            return 'bg-purple-500 text-white';
        }
        if (isOwnBooking) {
            return 'bg-blue-500 text-white';
        }
        return 'bg-gray-200 text-gray-700';
    };

    const getBookingStatus = () => {
        if (!isBooked) {
            return 'Verfügbar';
        }
        if (bookingType === 'maintenance') {
            return 'Wartung';
        }
        if (bookingType === 'tournament') {
            return 'Turnier';
        }
        if (isOwnBooking && !currentUser?.isAdmin) {
            return 'Meine Buchung';
        }
        return 'Belegt';
    };

    return (
        <div className="relative">
            <button
                className={`w-full p-3 rounded-lg font-medium transition-colors ${getSlotStyle()}`}
                onClick={() => !isBooked && handleBook()}
                disabled={isBooked}
            >
                <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{slot}</span>
                    <span className="text-sm">{getBookingStatus()}</span>
                    {isBooked && (
                        currentUser?.isAdmin ? (
                            booking.user_name && <span className="text-sm font-normal">{booking.user_name}</span>
                        ) : (<span className="text-sm"></span>)
                    )}
                </div>
            </button>

            {isBooked && canCancel(booking) && (
                <button
                    onClick={() => onCancel(booking.id)}
                    className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-300 bg-white/80"
                    aria-label="Buchung stornieren"
                >
                    <X className="w-4 h-4 text-gray-600"/>
                </button>
            )}

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Neue Buchung</AlertDialogTitle>
                        <AlertDialogDescription>
                            Wählen Sie den Buchungstyp für {slot} Uhr
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Buchungstyp wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="regular">Normal</SelectItem>
                                <SelectItem value="tournament">Turnier</SelectItem>
                                <SelectItem value="maintenance">Wartung</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <Button onClick={handleConfirmBooking}>Buchen</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BookingSlot;