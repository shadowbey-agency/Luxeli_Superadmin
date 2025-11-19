import 'package:flutter/material.dart';
import '../models/laundry_request.dart';

class LaundryRequestDetailsModal extends StatelessWidget {
  final LaundryRequest request;
  final VoidCallback onCancelRequest;

  const LaundryRequestDetailsModal({
    super.key,
    required this.request,
    required this.onCancelRequest,
  });

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[700], fontSize: 14)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Request details',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Request Info Section
          Card(
            elevation: 1,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            margin: const EdgeInsets.only(bottom: 16),
            child: ExpansionTile(
              initiallyExpanded: true,
              title: const Text(
                'Request info',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildDetailRow('Service', 'Laundry'),
                      _buildDetailRow('ID', request.id),
                      _buildDetailRow(
                        'Request Date',
                        '${request.formattedDate} ${request.formattedTime}',
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            request
                                .formattedDate, // Display date again for context
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
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
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Service Details Section
          Card(
            elevation: 1,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            margin: const EdgeInsets.only(bottom: 24),
            child: ExpansionTile(
              initiallyExpanded: true,
              title: const Text(
                'Service details',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildDetailRow('Service', request.servicesSummary),
                      _buildDetailRow(
                        'Number Of Units',
                        'x${request.piece}',
                      ), // Fixed: changed from numberOfUnits to piece
                      _buildDetailRow(
                        'Pick Up',
                        '${request.formattedDate} ${request.formattedTime}',
                      ), // Fixed: changed from pickupOption to formatted date/time
                      _buildDetailRow('Priority', request.priorityText),
                      const SizedBox(height: 8),
                      Text(
                        'Additional Notes',
                        style: TextStyle(color: Colors.grey[700], fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          request.notes?.isNotEmpty == true
                              ? request.notes!
                              : 'No additional notes.', // Fixed: handle nullable notes
                          style: TextStyle(
                            color: Colors.grey[800],
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: request.status == LaundryStatus.newStatus
                  ? onCancelRequest
                  : null, // Fixed: changed from pending to newStatus
              style: ElevatedButton.styleFrom(
                backgroundColor: request.status == LaundryStatus.newStatus
                    ? Colors.red
                    : Colors.grey, // Fixed: changed from pending to newStatus
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text(
                'Cancel Request',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
