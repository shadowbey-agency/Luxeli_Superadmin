import 'package:flutter/material.dart';
import '../models/booking_model.dart' as booking_model;
import '../models/service.dart';
import '../models/booking_intern_request.dart';
import '../services/booking_service.dart';

// Type alias for the model Booking class to avoid naming conflicts
typedef BookingModel = booking_model.Booking;

// Define the Booking class used in the provider
class ProviderBooking {
  final String id;
  final String serviceName;
  final String status;
  final DateTime date;
  final String time;
  final String notes;

  ProviderBooking({
    required this.id,
    required this.serviceName,
    required this.status,
    required this.date,
    required this.time,
    required this.notes,
  });

  // Convert to the model Booking class
  BookingModel toModelBooking() {
    return BookingModel(
      id: id,
      serviceId: '', // Not available in this class
      serviceName: serviceName,
      serviceImage: 'https://picsum.photos/seed/service/400/300',
      serviceDescription: '',
      price: 0.0,
      bookingDate: date,
      timeSlot: time,
      customerNotes: notes,
      status: status,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }
}

// Define the Intern Request class used in the provider
class ProviderInternRequest {
  final String id;
  final String category;
  final String status;
  final String date;
  final String time;
  final String? notes;

  ProviderInternRequest({
    required this.id,
    required this.category,
    required this.status,
    required this.date,
    required this.time,
    this.notes,
  });
}

// Dummy services data for demonstration
final List<Service> dummyServices = [
  Service(
    id: '1',
    name: 'Luxury Pool Access',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 20.0,
    imageUrl:
        'https://picsum.photos/seed/pool/400/300', // Using picsum as a reliable placeholder
    category: 'Leisure',
    location: 'Main Pool Area',
    availableDate: DateTime(2025, 1, 15),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '2',
    name: 'Spa & Wellness Package',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 0.0, // Example of a free service
    imageUrl:
        'https://picsum.photos/seed/spa/400/300', // Using picsum as a reliable placeholder
    category: 'Wellness',
    location: 'Spa Center',
    availableDate: DateTime(2025, 1, 20),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '3',
    name: 'Fine Dining Experience',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 50.0,
    imageUrl:
        'https://picsum.photos/seed/dining/400/300', // Using picsum as a reliable placeholder
    category: 'Dining',
    location: 'Rooftop Restaurant',
    availableDate: DateTime(2025, 2, 1),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '4',
    name: 'Exclusive Party Night',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 20.0,
    imageUrl:
        'https://picsum.photos/seed/party/400/300', // Using picsum as a reliable placeholder
    category: 'Events',
    location: 'Grand Ballroom',
    availableDate: DateTime(2025, 2, 10),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
];

class BookingProvider with ChangeNotifier {
  List<ProviderBooking> _bookings = [];
  List<ProviderInternRequest> _internRequests = [];
  List<Service> _availableServices = [];
  bool _isLoading = false;
  String _userId = '';
  String _authToken = '';
  String _errorMessage = '';

  // Getters
  List<ProviderBooking> get bookings => [..._bookings];
  List<ProviderInternRequest> get internRequests => [..._internRequests];
  List<Service> get availableServices => [..._availableServices];
  bool get isLoading => _isLoading;
  String get userId => _userId;
  String get authToken => _authToken;
  String get errorMessage => _errorMessage;

  // Set user credentials (userId and token) for API authentication
  void setCredentials(String userId, String token) {
    _userId = userId;
    _authToken = token;
  }

  // Load bookings from the API
  Future<void> loadBookings() async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    notifyListeners();

    try {
      final response = await BookingService.getMyRequests(token: _authToken);

      if (response != null && response['success'] == true) {
        final List requestsData = response['data']['requests'];
        _bookings = requestsData.map<ProviderBooking>((requestJson) {
          // Convert from model Booking to provider Booking
          final modelBooking = BookingModel.fromJson(requestJson);
          return ProviderBooking(
            id: modelBooking.id,
            serviceName: modelBooking.serviceName,
            status: modelBooking.status,
            date: modelBooking.bookingDate,
            time: modelBooking.timeSlot,
            notes: modelBooking.customerNotes,
          );
        }).toList();
        _errorMessage = '';
      } else {
        _errorMessage = response?['message'] ?? 'Failed to load bookings';
      }
    } catch (e) {
      _errorMessage = 'Error loading bookings: $e';
      print('Error loading bookings: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load intern requests from the API
  Future<void> loadInternRequests() async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    notifyListeners();

    try {
      final response = await BookingService.getMyInternRequests(
        token: _authToken,
      );

      if (response != null && response['success'] == true) {
        final List requestsData = response['data']['requests'];
        _internRequests = requestsData.map<ProviderInternRequest>((
          requestJson,
        ) {
          // Convert from model BookingInternRequest to provider InternRequest
          final modelRequest = BookingInternRequest.fromJson(requestJson);
          return ProviderInternRequest(
            id: modelRequest.id,
            category: modelRequest.category,
            status: modelRequest.status,
            date: modelRequest.reservation.date,
            time: modelRequest.reservation.time,
            notes: modelRequest.notes,
          );
        }).toList();
        _errorMessage = '';
      } else {
        _errorMessage =
            response?['message'] ?? 'Failed to load intern requests';
        print('Failed to load intern requests: $_errorMessage');
      }
    } catch (e) {
      _errorMessage = 'Error loading intern requests: $e';
      print('Error loading intern requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load all requests (both bookings and intern requests)
  Future<void> loadAllRequests() async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      // Load bookings
      await loadBookings();

      // Load intern requests
      await loadInternRequests();
    } catch (e) {
      _errorMessage = 'Error loading requests: $e';
      print('Error loading requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load available services from the API
  Future<void> loadAvailableServices() async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    notifyListeners();

    try {
      final response = await BookingService.getAvailableServices(
        token: _authToken,
      );

      if (response != null && response['success'] == true) {
        final List servicesData = response['data']['services'];
        _availableServices = servicesData.map<Service>((serviceJson) {
          return Service.fromJson(serviceJson);
        }).toList();
        _errorMessage = '';
      } else {
        _errorMessage = response?['message'] ?? 'Failed to load services';
        // Fallback to dummy services if API fails
        await Future.delayed(const Duration(milliseconds: 500));
        _availableServices = dummyServices;
      }
    } catch (e) {
      _errorMessage = 'Error loading services: $e';
      print('Error loading services: $e');
      // Fallback to dummy services if API fails
      await Future.delayed(const Duration(milliseconds: 500));
      _availableServices = dummyServices;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new booking from a model
  Future<void> addBookingFromModel(BookingModel bookingModel) async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      // Call the API to create the booking
      final response = await BookingService.createBooking(
        token: _authToken,
        booking: bookingModel,
      );

      if (response != null && response['success'] == true) {
        final createdBooking = BookingModel.fromJson(
          response['data']['request'],
        );

        // Convert model booking to provider booking
        final booking = ProviderBooking(
          id: createdBooking.id,
          serviceName: createdBooking.serviceName,
          status: createdBooking.status,
          date: createdBooking.bookingDate,
          time: createdBooking.timeSlot,
          notes: createdBooking.customerNotes,
        );

        // Add to the local list
        _bookings.insert(0, booking);
        _errorMessage = '';
      } else {
        _errorMessage = response?['message'] ?? 'Failed to create booking';
      }
    } catch (e) {
      _errorMessage = 'Error adding booking: $e';
      print('Error adding booking: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new intern request
  Future<void> addInternRequest({
    required String category,
    required String date,
    required String time,
    String? notes,
  }) async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      // Call the API to create the intern request
      final response = await BookingService.createInternRequest(
        token: _authToken,
        category: category,
        reservation: {'date': date, 'time': time},
        notes: notes,
      );

      if (response != null && response['success'] == true) {
        final createdRequest = BookingInternRequest.fromJson(
          response['data']['request'],
        );

        // Convert model request to provider request
        final request = ProviderInternRequest(
          id: createdRequest.id,
          category: createdRequest.category,
          status: createdRequest.status,
          date: createdRequest.reservation.date,
          time: createdRequest.reservation.time,
          notes: createdRequest.notes,
        );

        // Add to the local list
        _internRequests.insert(0, request);
        _errorMessage = '';
      } else {
        _errorMessage =
            response?['message'] ?? 'Failed to create intern request';
      }
    } catch (e) {
      _errorMessage = 'Error adding intern request: $e';
      print('Error adding intern request: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Remove a booking (cancel)
  Future<void> removeBooking(String bookingId) async {
    if (_authToken.isEmpty) return;

    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final response = await BookingService.cancelRequest(
        token: _authToken,
        requestId: bookingId,
      );

      if (response != null && response['success'] == true) {
        _bookings.removeWhere((booking) => booking.id == bookingId);
      } else {
        _errorMessage = response?['message'] ?? 'Failed to cancel booking';
      }
    } catch (e) {
      _errorMessage = 'Error canceling booking: $e';
      print('Error canceling booking: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
