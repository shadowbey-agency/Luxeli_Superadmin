import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/models/activity_model.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class ActivityCardWidget extends StatelessWidget {
  final Activity activity;

  const ActivityCardWidget({super.key, required this.activity});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (activity.activityImage != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(12),
              ),
              child: Image.network(
                activity.activityImage!,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  // Fallback container with icon if image fails to load
                  return Container(
                    height: 200,
                    width: double.infinity,
                    color: const Color(0xFFE0E0E0),
                    child: const Icon(
                      Icons.image_not_supported,
                      color: Color(0xFF9E9E9E),
                      size: 50,
                    ),
                  );
                },
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity.activityTitle,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  activity.activityDescription,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Published: ${_formatDate(activity.createdAt)}',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        _requestActivity(context, activity);
                      },
                      child: const Text('Request'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _requestActivity(BuildContext context, Activity activity) async {
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    // Show loading indicator
    scaffoldMessenger.showSnackBar(
      const SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(width: 16),
            Text('Submitting request...'),
          ],
        ),
        backgroundColor: Colors.blue,
      ),
    );

    try {
      final activitiesProvider = Provider.of<ActivitiesProvider>(
        context,
        listen: false,
      );

      // Get guest provider to access token
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);

      final success = await activitiesProvider.createActivityRequest(
        activityId: activity.id,
        guestNotes: 'Request for: ${activity.activityDescription}',
        preferredDate: DateTime.now(),
        token: guestProvider.guestData!.token,
      );

      scaffoldMessenger.hideCurrentSnackBar();

      if (success) {
        scaffoldMessenger.showSnackBar(
          const SnackBar(
            content: Text('Activity request submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        scaffoldMessenger.showSnackBar(
          const SnackBar(
            content: Text(
              'Failed to submit activity request. Please try again.',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      scaffoldMessenger.hideCurrentSnackBar();
      scaffoldMessenger.showSnackBar(
        const SnackBar(
          content: Text('An error occurred. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}
