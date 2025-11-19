import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:luxeli_app/features/delivery/widgets/list/delivery_list.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/delivery/providers/delivery_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/delivery/screens/request_food_screen.dart'; // Add this import
import 'package:luxeli_app/features/delivery/models/delivery_request.dart'; // Import DeliveryRequest

class DeliveryScreen extends StatelessWidget {
  const DeliveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRequests(context);
    });

    return ServiceScreenWidget(
      title: 'Delivery',
      serviceTitle: 'Delivery service',
      description: 'Send or receive items quickly and safely.',
      assetName: 'assets/images/icons/deliveryicon.png',
      fallbackIcon: Icons.delivery_dining,
      buildContent: (context) {
        return Consumer<DeliveryProvider>(
          builder: (context, deliveryProvider, child) {
            if (deliveryProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            // Check if there are any delivery requests
            final hasRequests = deliveryProvider.deliveryRequests.isNotEmpty;

            return hasRequests ? const DeliveryList() : _buildNoRequestsState();
          },
        );
      },
      onAddRequest: () {
        _showAddRequestScreen(context); // Implement add request functionality
      },
    );
  }

  void _loadRequests(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final deliveryProvider = Provider.of<DeliveryProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    if (token != null) {
      deliveryProvider.setToken(token);
      // loadRequests is now called automatically in setToken
    }
  }

  void _showAddRequestScreen(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const RequestFoodScreen(
          onDeliveryRequestAdded: _handleDeliveryRequestAdded,
        ),
      ),
    );
  }

  static void _handleDeliveryRequestAdded(DeliveryRequest request) {
    // This will be called when a new request is added
    // We don't need to do anything here as the Provider will handle the state
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
              assetName: 'assets/images/icons/deliveryemptyicon.png',
              width: 40,
              height: 40,
              fallbackIcon: Icons.delivery_dining,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'No delivery requests available',
            style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }
}
