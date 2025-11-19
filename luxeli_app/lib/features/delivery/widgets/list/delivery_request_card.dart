import 'package:flutter/material.dart';
import 'package:luxeli_app/features/delivery/models/delivery_request.dart';

class DeliveryRequestCard extends StatelessWidget {
  final DeliveryRequest request;

  const DeliveryRequestCard({super.key, required this.request});

  @override
  Widget build(BuildContext context) {
    final isPending = request.status == DeliveryStatus.pending;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'ID : ${request.id.substring(0, 5)}', // Truncate ID for display
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF333333),
                ),
              ),
              _buildStatusTag(request.statusText),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '${request.formattedDate} ${request.formattedTime}',
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Color(0xFF666666),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Request type',
                style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
              ),
              Text(
                request.pickupOption,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
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
                'Items',
                style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
              ),
              Text(
                'x${request.totalItemsCount}', // Show total item count
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF333333),
                ),
              ),
            ],
          ),
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
                    side: const BorderSide(color: Color(0xFFFBFAFA)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                  ),
                  child: const Text(
                    'View details',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                ),
              ),
              if (isPending) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Handle cancel request
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                    child: const Text(
                      'Cancel request',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
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
    );
  }

  Widget _buildStatusTag(String status) {
    Color backgroundColor;
    Color textColor;

    switch (status) {
      case 'Pending':
        backgroundColor = const Color(0xfffcf9f5); // Light orange
        textColor = const Color(0xffD1924F);
        break;
      case 'Completed':
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
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xfff2e4d3), width: 1),
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: textColor,
        ),
      ),
    );
  }
}
