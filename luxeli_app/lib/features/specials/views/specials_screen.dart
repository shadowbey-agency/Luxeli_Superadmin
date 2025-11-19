import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/service_screen_widget.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';

import 'package:provider/provider.dart';
import 'package:luxeli_app/features/specials/providers/specials_provider.dart';
import 'package:luxeli_app/features/specials/widgets/list/specials_list.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class SpecialsScreen extends StatelessWidget {
  const SpecialsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRequests(context);
    });

    return ServiceScreenWidget(
      title: 'Special Requests',
      serviceTitle: 'Special service request',
      description:
          'Request special services tailored to your needs. Your requests will be visible both in the app and on the website.',
      assetName: 'assets/images/icons/specialicon.png',
      fallbackIcon: Icons.star,
      buildContent: (context) {
        return Consumer<SpecialsProvider>(
          builder: (context, specialsProvider, child) {
            final hasRequests = specialsProvider.requests.isNotEmpty;
            if (specialsProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            return hasRequests ? const SpecialsList() : _buildNoRequestsState();
          },
        );
      },
      onAddRequest: () {
        // Show dialog to collect special service requests
        _showAddSpecialRequestDialog(context);
      },
    );
  }

  void _loadRequests(BuildContext context) {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final specialsProvider = Provider.of<SpecialsProvider>(
      context,
      listen: false,
    );

    final token = guestProvider.guestData?.token;
    if (token != null) {
      specialsProvider.setToken(token);
      specialsProvider.loadRequests();
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
              assetName: 'assets/images/icons/specialemptyicon.png',
              width: 40,
              height: 40,
              fallbackIcon: Icons.star,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'No requests available',
            style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
          ),
          const SizedBox(height: 8),
          const Text(
            'Create your first special request',
            style: TextStyle(fontSize: 14, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }

  void _showAddSpecialRequestDialog(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Request Special Service'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Title',
                  hintText: 'Enter a title for your request',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText:
                      'Describe your special service request in detail...',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () async {
                final title = titleController.text.trim();
                final description = descriptionController.text.trim();

                if (title.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Please enter a title for your request'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                // Get the provider
                final specialsProvider = Provider.of<SpecialsProvider>(
                  context,
                  listen: false,
                );

                // Submit the request
                final success = await specialsProvider.createRequest(
                  title: title,
                  description: description.isEmpty ? null : description,
                );

                if (success) {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Special service request submitted successfully!',
                      ),
                      backgroundColor: Colors.green,
                    ),
                  );

                  // Reload the requests
                  _loadRequests(context);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        specialsProvider.errorMessage ??
                            'Failed to submit request',
                      ),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }
}
