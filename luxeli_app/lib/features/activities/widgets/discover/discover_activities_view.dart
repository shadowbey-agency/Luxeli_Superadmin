import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/features/activities/widgets/discover/activity_card_widget.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class DiscoverActivitiesView extends StatelessWidget {
  const DiscoverActivitiesView({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadActivities(context);
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Discover Activities'),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Consumer<ActivitiesProvider>(
        builder: (context, activitiesProvider, child) {
          if (activitiesProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (activitiesProvider.errorMessage != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(activitiesProvider.errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => _loadActivities(context),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (activitiesProvider.activities.isEmpty) {
            return const Center(
              child: Text('No activities available'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: activitiesProvider.activities.length,
            itemBuilder: (context, index) {
              final activity = activitiesProvider.activities[index];
              return ActivityCardWidget(activity: activity);
            },
          );
        },
      ),
    );
  }

  void _loadActivities(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final activitiesProvider = Provider.of<ActivitiesProvider>(context, listen: false);

    final token = guestProvider.guestData?.token;
    if (token != null) {
      activitiesProvider.setToken(token);
      activitiesProvider.fetchActivities();
    }
  }
}