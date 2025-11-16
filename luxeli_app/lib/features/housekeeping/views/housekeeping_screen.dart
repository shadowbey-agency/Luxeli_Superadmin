import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/list/housekeeping_list.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/add_request_options_modal.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

// Temporary style definitions to maintain UI consistency
class HousekeepingTextStyles {
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

class HousekeepingButtonStyles {
  static ButtonStyle elevatedButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: Color(0xFF2196F3),
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );
}

class HousekeepingScreen extends StatelessWidget {
  final IconData? icon;
  const HousekeepingScreen({super.key, this.icon});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRequests(context);
    });

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Consumer<HousekeepingProvider>(
          builder: (context, housekeepingProvider, child) {
            final hasRequests = housekeepingProvider.requests.isNotEmpty;
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
                            'Housekeeping',
                            style: HousekeepingTextStyles.cleaningTypeTitle,
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
                                    'Housekeeping service',
                                    style: HousekeepingTextStyles.labelText,
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Keep your room spotless and comfortable.',
                                    style: HousekeepingTextStyles
                                        .pendingStatusText,
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
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(14.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Requests',
                                style: HousekeepingTextStyles.cleaningTypeTitle,
                              ),
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: const BoxDecoration(
                                  color: Colors.grey,
                                  shape: BoxShape.circle,
                                ),
                                child: GestureDetector(
                                  onTap: () {},
                                  child: SvgIcon(
                                    assetName: AppIcons.filter,
                                    size: 24,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Expanded(
                          child: housekeepingProvider.isLoading
                              ? const Center(child: CircularProgressIndicator())
                              : hasRequests
                              ? const HousekeepingList()
                              : _buildNoRequestsState(),
                        ),
                      ],
                    ),
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
              builder: (context) => const AddRequestOptionsModal(),
            );
          },
          style: HousekeepingButtonStyles.elevatedButtonStyle,
          child: const Text(
            'Add new request',
            style: HousekeepingTextStyles.confirmButtonText,
          ),
        ),
      ),
    );
  }

  void _loadRequests(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final housekeepingProvider = Provider.of<HousekeepingProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    if (token != null) {
      housekeepingProvider.setToken(token);
      housekeepingProvider.loadRequests();
    }
  }

  Widget _buildNoRequestsState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFE3F2FD),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFBBDEFB), width: 2),
            ),
            child: SvgIcon(assetName: AppIcons.cleaning, size: 40),
          ),
          const SizedBox(height: 16),
          const Text(
            'No requests available',
            style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }
}
