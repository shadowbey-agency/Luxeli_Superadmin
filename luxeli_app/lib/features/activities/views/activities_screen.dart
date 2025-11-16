import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/features/activities/widgets/list/discover_activities_view.dart';
import 'package:luxeli_app/features/activities/widgets/request/add_activity_request_modal.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

// Temporary style definitions to maintain UI consistency
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

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Consumer<ActivitiesProvider>(
          builder: (context, activitiesProvider, child) {
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.arrow_back),
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Discover activities',
                            style: ActivitiesTextStyles.cleaningTypeTitle,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 2,
                            child: Padding(
                              padding: const EdgeInsets.only(left: 16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    'Activity service',
                                    style: ActivitiesTextStyles.labelText,
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Select and join in just a few taps.',
                                    style:
                                        ActivitiesTextStyles.pendingStatusText,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Flexible(
                            flex: 1,
                            child: Container(
                              height: 80,
                              alignment: Alignment.centerRight,
                              child: SvgIcon(
                                assetName: AppIcons.housekeeping,
                                size: 80,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Divider(),
                      const SizedBox(height: 16),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Discover activities',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.search),
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: activitiesProvider.isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : const DiscoverActivitiesView(),
                  ),
                ),
              ],
            );
          },
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ElevatedButton(
          onPressed: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: Colors.transparent,
              isScrollControlled: true,
              builder: (context) => const AddActivityRequestModal(),
            );
          },
          style: ActivitiesButtonStyles.elevatedButtonStyle,
          child: const Text(
            'Join activity',
            style: ActivitiesTextStyles.confirmButtonText,
          ),
        ),
      ),
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
