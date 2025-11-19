import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/booking_model.dart';

class BookingRequestCard extends StatelessWidget {
  final Booking booking;
  final VoidCallback? onCancelPressed;

  const BookingRequestCard({
    super.key,
    required this.booking,
    this.onCancelPressed,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormatter = DateFormat('dd/MM/yyyy');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'ID : ${booking.id.length > 5 ? booking.id.substring(0, 5) : booking.id}', // Truncate ID for display
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                _buildStatusTag(booking.status),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              '${dateFormatter.format(booking.bookingDate)} at ${booking.timeSlot}',
              style: const TextStyle(fontSize: 14, color: Color(0xFF666666)),
            ),
            const SizedBox(height: 12),
            // Service image
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                booking.serviceImage,
                height: 100,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 100,
                    width: double.infinity,
                    color: Colors.grey[300],
                    child: Icon(Icons.image, color: Colors.grey[600]),
                  );
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    height: 100,
                    width: double.infinity,
                    color: Colors.grey[300],
                    child: Center(
                      child: CircularProgressIndicator(
                        value: loadingProgress.expectedTotalBytes != null
                            ? loadingProgress.cumulativeBytesLoaded /
                                  loadingProgress.expectedTotalBytes!
                            : null,
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Service',
                  style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
                ),
                Text(
                  booking.serviceName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF333333),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Price',
                  style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
                ),
                Text(
                  '\$${booking.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF333333),
                  ),
                ),
              ],
            ),
            if (booking.customerNotes.isNotEmpty) ...[
              const SizedBox(height: 8),
              const Text(
                'Notes',
                style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
              ),
              Container(
                width: double.infinity,
                margin: const EdgeInsets.only(top: 4),
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Color(0xFFF8F8F8),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  booking.customerNotes,
                  style: TextStyle(color: Colors.black87),
                ),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // Handle view details
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF333333),
                      side: const BorderSide(color: Color(0xFFE0E0E0)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text(
                      'View details',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (booking.status == 'Pending') ...[
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onCancelPressed,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text(
                        'Cancel request',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusTag(String status) {
    Color backgroundColor;
    Color textColor;

    switch (status) {
      case 'Pending':
        backgroundColor = const Color(0xFFFFF3E0); // Light orange
        textColor = Colors.orange;
        break;
      case 'Confirmed':
        backgroundColor = const Color(0xFFE8F5E9); // Light green
        textColor = Colors.green;
        break;
      case 'Cancelled':
        backgroundColor = const Color(0xFFFFEBEE); // Light red
        textColor = Colors.red;
        break;
      default:
        backgroundColor = Colors.grey.shade200;
        textColor = Colors.grey.shade700;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: textColor,
        ),
      ),
    );
  }
}
