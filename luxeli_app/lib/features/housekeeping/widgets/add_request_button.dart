import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class AddRequestScreen extends StatelessWidget {
  AddRequestScreen({super.key});

  final _formKey = GlobalKey<FormState>();
  final ValueNotifier<String> _serviceType = ValueNotifier<String>('');
  final ValueNotifier<String> _notes = ValueNotifier<String>('');

  @override
  Widget build(BuildContext context) {
    void submitRequest() async {
      if (_formKey.currentState!.validate()) {
        final guestProvider = Provider.of<GuestProvider>(
          context,
          listen: false,
        );
        final token = guestProvider.guestData?.token;

        if (token == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Authentication error. Please login again.'),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }
        final loadingSnackBar = SnackBar(
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
        );

        ScaffoldMessenger.of(context).showSnackBar(loadingSnackBar);
        final success =
            await Provider.of<HousekeepingProvider>(
              context,
              listen: false,
            ).addRequest(
              type: 'custom cleaning',
              requestedFor: _serviceType.value,
              notes: _notes.value.isEmpty ? null : _notes.value,
            );
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        if (success) {
          Navigator.of(context).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Request submitted successfully!'),
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
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text(
                'Failed to submit request. Please try again.',
              ),
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Request'),
        backgroundColor: const Color(0xFF0A3B78),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                onChanged: (value) => _serviceType.value = value,
                decoration: InputDecoration(
                  labelText: 'Service Type',
                  hintText: 'e.g., Room Cleaning, Towel Change, Minibar Refill',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.white,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a service type';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                onChanged: (value) => _notes.value = value,
                decoration: InputDecoration(
                  labelText: 'Additional Notes (Optional)',
                  hintText: 'e.g., Please clean after 2 PM',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.white,
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
              Center(
                child: ElevatedButton(
                  onPressed: submitRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A3B78),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 40,
                      vertical: 16,
                    ),
                  ),
                  child: const Text(
                    'Submit Request',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
