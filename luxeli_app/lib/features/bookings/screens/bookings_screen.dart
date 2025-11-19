import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/list/booking_request_card.dart';
import '../widgets/intern_request_card.dart';
import '../screens/request_service_screen.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> {
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    // Load bookings and available services when the screen is initialized
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    try {
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);
      final bookingProvider = Provider.of<BookingProvider>(
        context,
        listen: false,
      );

      // Use actual user credentials from guest provider
      if (guestProvider.guestData != null) {
        bookingProvider.setCredentials(
          guestProvider.guestData!.userId,
          guestProvider.guestData!.token,
        );

        // Load both bookings and available services
        await Future.wait([
          bookingProvider
              .loadAllRequests(), // Load all requests including intern requests
          bookingProvider.loadAvailableServices(),
        ]);
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load data: $e';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.grey[50],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          'Bookings',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          Consumer2<BookingProvider, GuestProvider>(
            builder: (context, bookingProvider, guestProvider, child) {
              // Check if user is logged in
              if (guestProvider.guestData == null) {
                return const Center(
                  child: Text('Please log in to view bookings'),
                );
              }

              // Show loading indicator if we're still loading initial data
              if (_isLoading || bookingProvider.isLoading) {
                return const Center(child: CircularProgressIndicator());
              }

              // Show error message if there was an error loading data
              if (_errorMessage.isNotEmpty ||
                  (bookingProvider.errorMessage.isNotEmpty)) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error, size: 40, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(
                        _errorMessage.isNotEmpty
                            ? _errorMessage
                            : bookingProvider.errorMessage,
                        style: TextStyle(fontSize: 16, color: Colors.grey[700]),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _isLoading = true;
                            _errorMessage = '';
                          });
                          _loadData();
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                );
              }

              return SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Bookings service',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Discover and book hotel services and experiences.',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 20),
                          // Calendar image
                          Flexible(
                            child: Image.network(
                              'https://picsum.photos/seed/calendar/100/100', // Using picsum as a reliable placeholder
                              height: 100,
                              width: 100,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  height: 100,
                                  width: 100,
                                  color: Colors.grey[300],
                                  child: Icon(
                                    Icons.calendar_today,
                                    color: Colors.grey[600],
                                  ),
                                );
                              },
                              loadingBuilder:
                                  (context, child, loadingProgress) {
                                    if (loadingProgress == null) return child;
                                    return Container(
                                      height: 100,
                                      width: 100,
                                      color: Colors.grey[300],
                                      child: Center(
                                        child: CircularProgressIndicator(
                                          value:
                                              loadingProgress
                                                      .expectedTotalBytes !=
                                                  null
                                              ? loadingProgress
                                                        .cumulativeBytesLoaded /
                                                    loadingProgress
                                                        .expectedTotalBytes!
                                              : null,
                                        ),
                                      ),
                                    );
                                  },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 40),

                    // Show message if no requests (both bookings and intern requests)
                    if (bookingProvider.bookings.isEmpty &&
                        bookingProvider.internRequests.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.grey[200],
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.calendar_month,
                                size: 40,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No requests available',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20.0,
                            ),
                            child: Text(
                              'Your Requests',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey[800],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Show regular bookings
                          ...bookingProvider.bookings.map(
                            (booking) => BookingRequestCard(
                              booking: booking.toModelBooking(),
                              onCancelPressed: () {
                                // Handle cancel request
                                bookingProvider.removeBooking(booking.id);
                              },
                            ),
                          ),

                          // Show intern requests if any
                          if (bookingProvider.internRequests.isNotEmpty) ...[
                            const Divider(
                              height: 32,
                              thickness: 1,
                              indent: 16,
                              endIndent: 16,
                              color: Color(0xFFE0E0E0),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20.0,
                              ),
                              child: Text(
                                'Intern Requests',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey[800],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            ...bookingProvider.internRequests.map(
                              (request) => InternRequestCard(
                                internRequest: request,
                                onCancelPressed: () {
                                  // Handle cancel request for intern requests
                                  // TODO: Implement cancel functionality for intern requests
                                },
                              ),
                            ),
                          ],
                        ],
                      ),
                    // Add more content here if there were actual bookings to display
                    const SizedBox(
                      height: 100,
                    ), // Space for the fixed bottom button
                  ],
                ),
              );
            },
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const RequestServiceScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D47A1), // Dark blue
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Add new request',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
