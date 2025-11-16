import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/request_model.dart';
import '../providers/request_provider.dart';

class RequestCard extends StatelessWidget {
  final RequestModel request;

  const RequestCard({super.key, required this.request});

  @override
  Widget build(BuildContext context) {
    final details = request.getDetailsMap();
    final firstDetailKey = details.isNotEmpty ? details.keys.first : 'Date';
    final firstDetailValue = details.isNotEmpty ? details.values.first : '';

    return Container(
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: _getIconBackgroundColor(),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_getIcon(), size: 20, color: _getIconColor()),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        request.typeText,
                        style: TextStyle(
                          fontFamily: 'Fustat',
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'ID : ${request.id}',
                        style: TextStyle(
                          fontFamily: 'Fustat',
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.black.withValues(alpha: 0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusBackgroundColor(),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    request.statusText,
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _getStatusTextColor(),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          DateFormat('MMM').format(request.date),
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: Colors.black.withValues(alpha: 0.6),
                          ),
                        ),
                        SizedBox(width: 25),
                        Text(
                          firstDetailKey,
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 10,
                            fontWeight: FontWeight.w400,
                            color: Colors.black.withValues(alpha: 0.6),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          DateFormat('dd').format(request.date),
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        SizedBox(width: 30),
                        Text(
                          'Request type',
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 10,
                            fontWeight: FontWeight.w400,
                            color: Colors.black.withValues(alpha: 0.6),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(width: 40),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        DateFormat('dd/MM/yyyy HH:mm a').format(request.date),
                        style: TextStyle(
                          fontFamily: 'Fustat',
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.black.withValues(alpha: 0.6),
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        firstDetailValue,
                        style: TextStyle(
                          fontFamily: 'Fustat',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            _buildActionButtons(context),
            Divider(height: 16, thickness: 1, color: Color(0xFFE0E0E0)),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () {
              context.read<RequestProvider>().viewRequestDetails(request.id);
            },
            child: Container(
              padding: EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Color(0xFFE8E8E8), width: 1),
              ),
              child: Center(
                child: Text(
                  'View details',
                  style: TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
            ),
          ),
        ),
        if (request.status == RequestStatus.pending) ...[
          SizedBox(width: 12),
          Expanded(
            child: GestureDetector(
              onTap: () {
                _showCancelDialog(context);
              },
              child: Container(
                padding: EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Color(0xFFEC1C2C),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    'Cancel request',
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: Text('Cancel Request'),
          content: Text('Are you sure you want to cancel this request?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: Text('No'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
                context.read<RequestProvider>().cancelRequest(request.id);
              },
              child: Text(
                'Yes, Cancel',
                style: TextStyle(color: Color(0xFFEC1C2C)),
              ),
            ),
          ],
        );
      },
    );
  }

  IconData _getIcon() {
    switch (request.type) {
      case RequestType.housekeeping:
        return Icons.cleaning_services_outlined;
      case RequestType.laundry:
        return Icons.local_laundry_service_outlined;
      case RequestType.delivery:
        return Icons.delivery_dining_outlined;
      case RequestType.roomService:
        return Icons.room_service_outlined;
      case RequestType.maintenance:
        return Icons.build_outlined;
    }
  }

  Color _getIconBackgroundColor() {
    switch (request.type) {
      case RequestType.housekeeping:
        return Color(0xFFFFF5F5);
      case RequestType.laundry:
        return Color(0xFFF0F9FF);
      case RequestType.delivery:
        return Color(0xFFFFFBEB);
      default:
        return Color(0xFFF5F5F5);
    }
  }

  Color _getIconColor() {
    switch (request.type) {
      case RequestType.housekeeping:
        return Color(0xFFEC1C2C);
      case RequestType.laundry:
        return Color(0xFF4195BF);
      case RequestType.delivery:
        return Color(0xFFF59E0B);
      default:
        return Color(0xFF666666);
    }
  }

  Color _getStatusBackgroundColor() {
    switch (request.status) {
      case RequestStatus.pending:
        return Color(0xFFFFF5E6);
      case RequestStatus.completed:
        return Color(0xFFE6F9F2);
      case RequestStatus.cancelled:
        return Color(0xFFFFE6E6);
    }
  }

  Color _getStatusTextColor() {
    switch (request.status) {
      case RequestStatus.pending:
        return Color(0xFFFF9500);
      case RequestStatus.completed:
        return Color(0xFF00B087);
      case RequestStatus.cancelled:
        return Color(0xFFEC1C2C);
    }
  }
}
