import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_model.dart';

class HousekeepingRequestDetail extends StatelessWidget {
  final HousekeepingRequest request;

  const HousekeepingRequestDetail({super.key, required this.request});

  @override
  Widget build(BuildContext context) {
    final isItemsNeeded = request.serviceType == 'Items needed';

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Request Details',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF333333),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Color(0xFF757575)),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildDetailRow('Request ID', request.id),
          _buildDetailRow('Request Type', request.serviceType),
          _buildDetailRow('Status', request.status),
          _buildDetailRow(
            'Request Time',
            DateFormat('dd/MM/yyyy hh:mm a').format(request.requestTime),
          ),
          if (request.notes != null && request.notes!.isNotEmpty)
            _buildDetailRow('Notes', request.notes!),
          if (isItemsNeeded &&
              request.items != null &&
              request.items!.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text(
              'Items Requested',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF333333),
              ),
            ),
            const SizedBox(height: 8),
            ...request.items!.entries.map(
              (entry) => _buildDetailRow(entry.key, 'x${entry.value}'),
            ),
          ],
          const SizedBox(height: 24),
          Center(
            child: ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A3B78),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 16,
                ),
              ),
              child: const Text(
                'Close',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF666666),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16, color: Color(0xFF333333)),
            ),
          ),
        ],
      ),
    );
  }
}
