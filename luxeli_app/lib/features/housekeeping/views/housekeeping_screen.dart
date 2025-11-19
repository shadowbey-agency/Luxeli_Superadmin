import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/list/housekeeping_list.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/add_request_options_modal.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

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

    return ServiceScreenWidget(
      title: 'Housekeeping',
      serviceTitle: 'Housekeeping service',
      description: 'Keep your room spotless and comfortable.',
      assetName: 'assets/images/icons/housekeepingicon.png',
      fallbackIcon: Icons.cleaning_services,
      buildContent: (context) {
        return Consumer<HousekeepingProvider>(
          builder: (context, housekeepingProvider, child) {
            final hasRequests = housekeepingProvider.requests.isNotEmpty;
            if (housekeepingProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            return hasRequests
                ? const HousekeepingList()
                : _buildNoRequestsState();
          },
        );
      },
      onAddRequest: () {
        showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(24)),
          ),
          builder: (context) => DraggableScrollableSheet(
            initialChildSize: 0.5,
            minChildSize: 0.3,
            maxChildSize: 1,
            expand: false,
            builder: (context, scrollController) {
              return Padding(
                padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(24)),
                  ),
                  child: const AddRequestOptionsModal(),
                ),
              );
            },
          ),
        );
      },
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
            child: PngIcon(
              assetName: 'assets/images/icons/housekeepingemptyicon.png',
              width: 40,
              height: 40,
              fallbackIcon: Icons.cleaning_services,
            ),
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
