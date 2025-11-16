import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/activities/providers/activities_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class AddActivityRequestModal extends StatefulWidget {
  const AddActivityRequestModal({super.key});

  @override
  State<AddActivityRequestModal> createState() =>
      _AddActivityRequestModalState();
}

class _AddActivityRequestModalState extends State<AddActivityRequestModal> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _imageController = TextEditingController();

  void _submitActivity() async {
    if (_formKey.currentState!.validate()) {
      // Capture context before async operation
      final scaffoldContext = context;

      // Get the guest token for API authentication
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);
      final token = guestProvider.guestData?.token;

      if (token == null) {
        // Show error if no token
        ScaffoldMessenger.of(scaffoldContext).showSnackBar(
          const SnackBar(
            content: Text('Authentication error. Please login again.'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      // Show loading indicator
      final loadingSnackBar = SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(width: 16),
            Text('Submitting activity...'),
          ],
        ),
        backgroundColor: Colors.blue,
      );

      ScaffoldMessenger.of(scaffoldContext).showSnackBar(loadingSnackBar);

      // Submit activity through the provider
      final success =
          await Provider.of<ActivitiesProvider>(
            context,
            listen: false,
          ).addActivity(
            activityTitle: _nameController.text,
            activityDescription: _descriptionController.text,
            activityImage: _imageController.text.isEmpty
                ? null
                : _imageController.text,
            createdBy: guestProvider.guestData?.guestName ?? 'Guest',
          );

      // Hide loading indicator
      ScaffoldMessenger.of(scaffoldContext).hideCurrentSnackBar();

      if (success) {
        // Close modal and show success message
        Navigator.of(scaffoldContext).pop();

        // Show success confirmation
        ScaffoldMessenger.of(scaffoldContext).showSnackBar(
          SnackBar(
            content: const Text('Activity submitted successfully!'),
            duration: const Duration(seconds: 2),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      } else {
        // Show error message
        ScaffoldMessenger.of(scaffoldContext).showSnackBar(
          SnackBar(
            content: const Text('Failed to submit activity. Please try again.'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _imageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Add Activity',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Activity Name',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an activity name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a description';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _imageController,
              decoration: const InputDecoration(
                labelText: 'Image URL (optional)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitActivity,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2196F3),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Submit Activity',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
