import 'package:flutter/material.dart';
import '../models/laundry_request.dart';

class LaundryRequestCard extends StatelessWidget {
  final LaundryRequest request;
  final VoidCallback onViewDetails;
  final VoidCallback onCancelRequest;

  const LaundryRequestCard({
    super.key,
    required this.request,
    required this.onViewDetails,
    required this.onCancelRequest,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
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
                  'ID : ${request.id}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: request.statusColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    request.statusText,
                    style: TextStyle(
                      color: request.statusColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              '${request.formattedDate} ${request.formattedTime}',
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Service',
                  style: TextStyle(color: Colors.grey[700], fontSize: 14),
                ),
                Text(
                  request.servicesSummary,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Number of Units',
                  style: TextStyle(color: Colors.grey[700], fontSize: 14),
                ),
                Text(
                  'x${request.piece}', // Fixed: changed from numberOfUnits to piece
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: onViewDetails,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF0D47A1),
                      side: const BorderSide(color: Color(0xFF0D47A1)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('View details'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed:
                        request.status ==
                            LaundryStatus
                                .newStatus // Fixed: changed from pending to newStatus
                        ? onCancelRequest
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: request.status == LaundryStatus.newStatus
                          ? Colors.red
                          : Colors
                                .grey, // Fixed: changed from pending to newStatus
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('Cancel request'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
