import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/features/specials/models/customized_service_request.dart';

class SpecialRequestCard extends StatelessWidget {
  final CustomizedServiceRequest request;

  const SpecialRequestCard({super.key, required this.request});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'ID : ${_truncateId(request.customId)}', // Safely truncate ID for display
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF333333),
                ),
              ),
              _buildStatusTag(request.status),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            DateFormat('dd/MM/yyyy').format(request.createdAt),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Color(0xFF666666),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            request.title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF333333),
            ),
          ),
          if (request.description != null &&
              request.description!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              request.description!,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Color(0xFF666666),
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
              if (request.status.toLowerCase() == 'new') ...[
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Handle cancel request
                      _showCancelConfirmationDialog(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          Colors.red, // Red color for cancel button
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                    child: const Text(
                      'Cancel',
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

  // Show confirmation dialog for canceling request
  void _showCancelConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Cancel Request'),
          content: const Text('Are you sure you want to cancel this request?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('No'),
            ),
            TextButton(
              onPressed: () {
                // Here you would typically call the provider to cancel the request
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Request canceled successfully'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Yes'),
            ),
          ],
        );
      },
    );
  }

  // Safely truncate ID to prevent RangeError
  String _truncateId(String id) {
    if (id.length <= 5) {
      return id;
    }
    return id.substring(0, 5);
  }

  Widget _buildStatusTag(String status) {
    Color backgroundColor;
    Color textColor;

    switch (status.toLowerCase()) {
      case 'new':
        backgroundColor = const Color(0xFFE3F2FD); // Light blue
        textColor = Colors.blue;
        break;
      case 'accepted':
        backgroundColor = const Color(0xFFE8F5E9); // Light green
        textColor = Colors.green;
        break;
      case 'completed':
        backgroundColor = const Color(0xFFE8F5E9); // Light green
        textColor = Colors.green;
        break;
      case 'canceled':
        backgroundColor = const Color(0xFFFFEBEE); // Light red
        textColor = Colors.red;
        break;
      case 'no-show':
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
        border: Border.all(color: Colors.grey.shade300, width: 1),
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
