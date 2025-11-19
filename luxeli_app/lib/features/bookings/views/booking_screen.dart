import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:luxeli_app/features/bookings/screens/request_service_screen.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/bookings/providers/booking_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/bookings/widgets/list/booking_request_card.dart';
import 'package:luxeli_app/features/bookings/widgets/intern_request_card.dart';

class BookingScreen extends StatelessWidget {
  final String image;
  final String name;
  final String description;
  final String price;

  const BookingScreen({
    super.key,
    required this.image,
    required this.name,
    required this.description,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRequests(context);
    });

    return ServiceScreenWidget(
      title: 'Bookings',
      serviceTitle: 'Booking service',
      description:
          'Book services for your stay. View all your booking requests including intern requests.',
      assetName: 'assets/images/icons/bookingicon.png',
      fallbackIcon: Icons.event,
      buildContent: (context) {
        return Consumer<BookingProvider>(
          builder: (context, bookingProvider, child) {
            if (bookingProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            final hasBookings = bookingProvider.bookings.isNotEmpty;
            final hasInternRequests = bookingProvider.internRequests.isNotEmpty;
            final hasRequests = hasBookings || hasInternRequests;

            if (!hasRequests) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    PngIcon(
                      assetName: 'assets/images/icons/bookingemptyicon.png',
                      width: 48,
                      height: 48,
                      fallbackIcon: Icons.event,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'No booking requests available',
                      style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
                    ),
                  ],
                ),
              );
            }

            // Combine all requests and sort by date
            final allRequests = <Widget>[];

            // Add booking requests
            if (hasBookings) {
              allRequests.add(
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text(
                    'Booking Requests',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
              );

              for (int i = 0; i < bookingProvider.bookings.length; i++) {
                final request = bookingProvider.bookings[i];
                allRequests.add(
                  BookingRequestCard(
                    booking: request
                        .toModelBooking(), // Convert to model booking
                  ),
                );
              }
            }

            // Add intern requests
            if (hasInternRequests) {
              if (hasBookings) {
                allRequests.add(
                  const Divider(
                    height: 32,
                    thickness: 1,
                    indent: 16,
                    endIndent: 16,
                    color: Color(0xFFE0E0E0),
                  ),
                );
              }

              allRequests.add(
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text(
                    'Intern Requests',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
              );

              for (int i = 0; i < bookingProvider.internRequests.length; i++) {
                final request = bookingProvider.internRequests[i];
                allRequests.add(InternRequestCard(internRequest: request));
              }
            }

            return ListView(
              padding: const EdgeInsets.all(16),
              children: allRequests,
            );
          },
        );
      },
      onAddRequest: () {
        // Navigate to the request service screen when Add Request is pressed
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const RequestServiceScreen()),
        );
      },
    );
  }

  void _loadRequests(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final bookingProvider = Provider.of<BookingProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    if (token != null) {
      bookingProvider.setCredentials(guestProvider.guestData!.userId, token);
      // Load all requests including intern requests
      bookingProvider.loadAllRequests();
    }
  }
}
