import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

import '../models/service.dart' as booking_service;
import '../providers/booking_provider.dart';
import '../services/booking_service.dart';
import '../widgets/circular_progress_indicator_with_text.dart';
import '../widgets/service_card.dart';
import '../widgets/service_details_modal.dart';

class RequestServiceScreen extends StatefulWidget {
  const RequestServiceScreen({super.key});

  @override
  State<RequestServiceScreen> createState() => _RequestServiceScreenState();
}

class _RequestServiceScreenState extends State<RequestServiceScreen> {
  int _currentStep = 1;
  booking_service.Service? _selectedService;
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  final TextEditingController _notesController = TextEditingController();
  bool _isLoadingServices = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadAvailableServices();
    });
  }

  Future<void> _loadAvailableServices() async {
    try {
      final bookingProvider = Provider.of<BookingProvider>(
        context,
        listen: false,
      );

      final guestProvider = Provider.of<GuestProvider>(context, listen: false);

      // Set credentials if not already set
      if (bookingProvider.userId.isEmpty || bookingProvider.authToken.isEmpty) {
        if (guestProvider.guestData != null) {
          bookingProvider.setCredentials(
            guestProvider.guestData!.userId,
            guestProvider.guestData!.token,
          );
        }
      }

      await bookingProvider.loadAvailableServices();
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load services: $e';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingServices = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _showServiceDetails(booking_service.Service service) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (context) {
        return ServiceDetailsModal(
          service: service,
          onBookNowPressed: () {
            Navigator.of(context).pop(); // Close modal
            setState(() {
              _selectedService = service;
              _currentStep = 2;
            });
          },
        );
      },
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime(2026),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  Widget _buildCategoryChip(String label, {bool isSelected = false}) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: Chip(
        label: Text(label),
        backgroundColor: isSelected
            ? const Color(0xFF0D47A1)
            : Colors.grey[200],
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.grey[800],
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? const Color(0xFF0D47A1) : Colors.transparent,
          ),
        ),
      ),
    );
  }

  Widget _buildStep1() {
    return Consumer2<BookingProvider, GuestProvider>(
      builder: (context, bookingProvider, guestProvider, child) {
        // Check if we're loading initial data or if the provider is loading
        if (_isLoadingServices || bookingProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        // Check for errors from either local state or provider
        if (_errorMessage.isNotEmpty ||
            bookingProvider.errorMessage.isNotEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error, color: Colors.red, size: 48),
                const SizedBox(height: 16),
                Text(
                  _errorMessage.isNotEmpty
                      ? _errorMessage
                      : bookingProvider.errorMessage,
                  style: const TextStyle(fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _isLoadingServices = true;
                      _errorMessage = '';
                    });
                    _loadAvailableServices();
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        final services = bookingProvider.availableServices;

        if (services.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.event_busy, size: 48, color: Colors.grey),
                SizedBox(height: 16),
                Text('No services available', style: TextStyle(fontSize: 16)),
                SizedBox(height: 8),
                Text(
                  'Please check back later',
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Choose your service',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Browse our available options and pick the one that suits your needs.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  const CircularProgressIndicatorWithText(
                    currentStep: 1,
                    totalSteps: 2,
                    radius: 20,
                    strokeWidth: 2,
                    progressColor: Color(0xFF0D47A1),
                    backgroundColor: Colors.grey,
                    textStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0D47A1),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Services',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: () {
                      setState(() {
                        _isLoadingServices = true;
                        _errorMessage = '';
                      });
                      _loadAvailableServices();
                    },
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                children: [
                  _buildCategoryChip('All', isSelected: true),
                  _buildCategoryChip('Category'),
                  _buildCategoryChip('Category'),
                  _buildCategoryChip('Category'),
                  _buildCategoryChip('Category'),
                ],
              ),
            ),
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(12.0),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 8.0,
                  mainAxisSpacing: 8.0,
                  childAspectRatio: 0.7, // Adjust as needed for card height
                ),
                itemCount: services.length,
                itemBuilder: (context, index) {
                  final service = services[index];
                  return ServiceCard(
                    service: service,
                    onBookPressed: () => _showServiceDetails(service),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildStep2() {
    final dateFormatter = DateFormat('dd/MM/yyyy');
    final timeFormatter = DateFormat('HH:mm');

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 20.0,
              vertical: 16.0,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Confirm your request details',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Check your service details and complete your request.',
                        style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                const CircularProgressIndicatorWithText(
                  currentStep: 2,
                  totalSteps: 2,
                  radius: 20,
                  strokeWidth: 2,
                  progressColor: Color(0xFF0D47A1),
                  backgroundColor: Colors.grey,
                  textStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0D47A1),
                  ),
                ),
              ],
            ),
          ),
          if (_selectedService != null)
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          _selectedService!.imageUrl,
                          width: 60,
                          height: 60,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: 60,
                              height: 60,
                              color: Colors.grey[300],
                              child: Icon(Icons.image, color: Colors.grey[600]),
                            );
                          },
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Container(
                              width: 60,
                              height: 60,
                              color: Colors.grey[300],
                              child: Center(
                                child: CircularProgressIndicator(
                                  value:
                                      loadingProgress.expectedTotalBytes != null
                                      ? loadingProgress.cumulativeBytesLoaded /
                                            loadingProgress.expectedTotalBytes!
                                      : null,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _selectedService!.name,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _selectedService!.description,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '\$${_selectedService!.price.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0D47A1),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Select Date & Time',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Card(
                        child: InkWell(
                          onTap: () => _selectDate(context),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today, size: 18),
                                const SizedBox(width: 8),
                                Text(
                                  dateFormatter.format(_selectedDate),
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Card(
                        child: InkWell(
                          onTap: () => _selectTime(context),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              children: [
                                const Icon(Icons.access_time, size: 18),
                                const SizedBox(width: 8),
                                Text(
                                  timeFormatter.format(
                                    DateTime(
                                      2022,
                                      1,
                                      1,
                                      _selectedTime.hour,
                                      _selectedTime.minute,
                                    ),
                                  ),
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Additional Notes',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _notesController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Any special requests or notes...',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding: const EdgeInsets.all(12),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (_selectedService != null) {
                        final bookingProvider = Provider.of<BookingProvider>(
                          context,
                          listen: false,
                        );

                        try {
                          final guestProvider = Provider.of<GuestProvider>(
                            context,
                            listen: false,
                          );
                          final token = guestProvider.guestData?.token;

                          if (token == null || token.isEmpty) {
                            throw Exception('User not authenticated');
                          }

                          final response = await BookingService.createRequest(
                            token: token,
                            serviceId: _selectedService!.id,
                            serviceName: _selectedService!.name,
                            serviceImage: _selectedService!.imageUrl,
                            serviceDescription: _selectedService!.description,
                            price: _selectedService!.price,
                            bookingDate: _selectedDate,
                            timeSlot:
                                '${_selectedTime.hour}:${_selectedTime.minute.toString().padLeft(2, '0')}',
                            customerNotes: _notesController.text.isNotEmpty
                                ? _notesController.text
                                : null,
                          );

                          if (response != null && response['success'] == true) {
                            // Show success message and navigate back
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Booking request submitted successfully!',
                                ),
                                backgroundColor: Colors.green,
                              ),
                            );
                            Navigator.of(context).pop();

                            // Reload bookings to show the new one
                            await bookingProvider.loadBookings();
                          } else {
                            // Show error message
                            final errorMessage =
                                response?['message'] ??
                                'Failed to submit booking request';
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(errorMessage),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Failed to submit booking: $e'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0D47A1),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text(
                      'Confirm Request',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          _currentStep == 1 ? 'Request Service' : 'Confirm Request',
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: _currentStep == 1 ? _buildStep1() : _buildStep2(),
    );
  }
}
