import '../models/booking_model.dart';

class BookingService {
  // In a real app, you would use a proper HTTP client and handle errors
  // For now, we'll simulate API calls with delays
  
  // Get all bookings for a user
  Future<List<Booking>> getBookings(String userId) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // For demo purposes, return some mock data
    return [
      Booking(
        id: '1',
        serviceId: 'service_1',
        serviceName: 'House Cleaning',
        serviceImage: 'assets/images/house_cleaning.jpg',
        serviceDescription: 'Professional house cleaning service',
        price: 120.0,
        bookingDate: DateTime.now().add(const Duration(days: 2)),
        timeSlot: '10:00 AM - 12:00 PM',
        customerNotes: 'Please focus on the kitchen and bathrooms',
        status: 'Confirmed',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        updatedAt: DateTime.now().subtract(const Duration(hours: 12)),
      ),
      Booking(
        id: '2',
        serviceId: 'service_2',
        serviceName: 'Laundry Service',
        serviceImage: 'assets/images/laundry.jpg',
        serviceDescription: 'Complete laundry and dry cleaning service',
        price: 45.0,
        bookingDate: DateTime.now().add(const Duration(days: 3)),
        timeSlot: '2:00 PM - 4:00 PM',
        customerNotes: 'Separate colors from whites',
        status: 'Pending',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        updatedAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
    ];
  }
  
  // Create a new booking
  Future<Booking> createBooking(Booking booking) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // For demo purposes, return the booking with an ID
    return booking.copyWith(id: '3');
  }
  
  // Update a booking
  Future<Booking> updateBooking(Booking booking) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // For demo purposes, return the booking
    return booking;
  }
  
  // Cancel a booking
  Future<void> cancelBooking(String bookingId) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
  }
}

// Extension to allow copying a Booking with modifications
extension BookingCopyWith on Booking {
  Booking copyWith({
    String? id,
    String? serviceId,
    String? serviceName,
    String? serviceImage,
    String? serviceDescription,
    double? price,
    DateTime? bookingDate,
    String? timeSlot,
    String? customerNotes,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Booking(
      id: id ?? this.id,
      serviceId: serviceId ?? this.serviceId,
      serviceName: serviceName ?? this.serviceName,
      serviceImage: serviceImage ?? this.serviceImage,
      serviceDescription: serviceDescription ?? this.serviceDescription,
      price: price ?? this.price,
      bookingDate: bookingDate ?? this.bookingDate,
      timeSlot: timeSlot ?? this.timeSlot,
      customerNotes: customerNotes ?? this.customerNotes,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}