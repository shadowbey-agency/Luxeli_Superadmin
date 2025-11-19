import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/features/activities/widgets/list/discover_activities_view.dart';
import 'package:luxeli_app/features/activities/widgets/request/add_activity_request_modal.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class ActivitiesTextStyles {
  static const cleaningTypeTitle = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Color(0xFF333333),
  );

  static const labelText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Color(0xFF333333),
  );

  static const pendingStatusText = TextStyle(
    fontSize: 14,
    color: Color(0xFF666666),
  );

  static const confirmButtonText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );
}

class ActivitiesButtonStyles {
  static ButtonStyle elevatedButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: Color(0xFF2196F3),
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );
}

class ActivitiesScreen extends StatelessWidget {
  const ActivitiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadActivities(context);
    });

    return ServiceScreenWidget(
      title: 'Discover activities',
      serviceTitle: 'Activity service',
      description: 'Select and join in just a few taps.',
      assetName: AppIcons.activity,
      fallbackIcon: Icons.local_activity,
      buildContent: (context) {
        return Consumer<ActivitiesProvider>(
          builder: (context, activitiesProvider, child) {
            if (activitiesProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            return const DiscoverActivitiesView();
          },
        );
      },
      onAddRequest: () {
        showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          isScrollControlled: true,
          builder: (context) => const AddActivityRequestModal(),
        );
      },
      showFilterIcon: false,
    );
  }

  void _loadActivities(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final activitiesProvider = Provider.of<ActivitiesProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    if (token != null) {
      activitiesProvider.setToken(token);
      activitiesProvider.loadActivities();
    }
  }
}
