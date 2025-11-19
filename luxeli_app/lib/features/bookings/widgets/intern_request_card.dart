import 'package:flutter/material.dart';

class InternRequestCard extends StatelessWidget {
  final dynamic internRequest; // Using dynamic to avoid import issues
  final VoidCallback? onCancelPressed;

  const InternRequestCard({
    super.key,
    required this.internRequest,
    this.onCancelPressed,
  });

  @override
  Widget build(BuildContext context) {
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
                  'ID : ${internRequest.id.length > 5 ? internRequest.id.substring(0, 5) : internRequest.id}', // Truncate ID for display
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
                _buildStatusTag(internRequest.status),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              '${internRequest.date} at ${internRequest.time}',
              style: const TextStyle(fontSize: 14, color: Color(0xFF666666)),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Category',
                  style: TextStyle(fontSize: 14, color: Color(0xFF666666)),
                ),
                Text(
                  internRequest.category,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF333333),
                  ),
                ),
              ],
            ),
            if (internRequest.notes != null &&
                internRequest.notes.toString().isNotEmpty) ...[
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
                  color: const Color(0xFFF8F8F8),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  internRequest.notes.toString(),
                  style: const TextStyle(color: Colors.black87),
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
                      _showDetailsDialog(context, internRequest);
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
                if (internRequest.status.toLowerCase() == 'new') ...[
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

  void _showDetailsDialog(BuildContext context, dynamic request) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Intern Request Details'),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                _detailRow('ID', request.id),
                _detailRow('Category', request.category),
                _detailRow('Status', request.status),
                _detailRow('Date', request.date),
                _detailRow('Time', request.time),
                if (request.notes != null &&
                    request.notes.toString().isNotEmpty)
                  _detailRow('Notes', request.notes.toString()),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
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
