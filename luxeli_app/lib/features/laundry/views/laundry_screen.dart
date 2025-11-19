import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/laundry/providers/laundry_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/laundry/widgets/add_laundry_request_modal.dart';

class LaundryScreen extends StatelessWidget {
  const LaundryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    print('Building LaundryScreen...');
    WidgetsBinding.instance.addPostFrameCallback((_) {
      print('Post frame callback - loading requests');
      _loadRequests(context);
    });

    return ServiceScreenWidget(
      title: 'Laundry',
      serviceTitle: 'Laundry service',
      description: 'Request laundry services for your clothes.',
      assetName: 'assets/images/icons/laundryicon.png',
      fallbackIcon: Icons.local_laundry_service,
      buildContent: (context) {
        print('Building laundry content...');
        return Consumer<LaundryProvider>(
          builder: (context, laundryProvider, child) {
            print(
              'Consumer builder called - requests count: ${laundryProvider.requests.length}, isLoading: ${laundryProvider.isLoading}',
            );

            if (laundryProvider.isLoading) {
              print('Showing loading indicator...');
              return const Center(child: CircularProgressIndicator());
            }

            final hasRequests = laundryProvider.requests.isNotEmpty;
            print('Has requests: $hasRequests');

            if (!hasRequests) {
              print('Showing no requests message...');
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    PngIcon(
                      assetName: 'assets/images/icons/laundryemptyicon.png',
                      width: 48,
                      height: 48,
                      fallbackIcon: Icons.local_laundry_service,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'No laundry requests available',
                      style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
                    ),
                  ],
                ),
              );
            }

            print('Showing ${laundryProvider.requests.length} requests...');
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: laundryProvider.requests.length,
              itemBuilder: (context, idx) {
                final request = laundryProvider.requests[idx];
                print('Building request item ${idx + 1}: ${request.id}');
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'ID : ${request.id}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              request.statusText,
                              style: const TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          request.service,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (request.notes != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            request.notes!,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                        const SizedBox(height: 8),
                        Text(
                          'Requested on ${request.formattedDate}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        );
      },
      onAddRequest: () {
        showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          isScrollControlled: true,
          builder: (context) => AddLaundryRequestModal(
            onLaundryAdded: () {
              // Refresh the laundry requests
              _loadRequests(context);
            },
          ),
        );
      },
    );
  }

  void _loadRequests(BuildContext context) {
    print('Loading laundry requests...');
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final laundryProvider = Provider.of<LaundryProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    print('Token available: ${token != null}');
    if (token != null) {
      print('Setting token and loading requests...');
      laundryProvider.setToken(token);
      laundryProvider.loadRequests();
    } else {
      print('No token available, cannot load requests');
    }
  }
}
