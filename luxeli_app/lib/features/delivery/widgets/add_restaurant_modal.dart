import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/delivery/providers/delivery_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class AddRestaurantModal extends StatefulWidget {
  final VoidCallback? onRestaurantAdded;

  const AddRestaurantModal({super.key, this.onRestaurantAdded});

  @override
  State<AddRestaurantModal> createState() => _AddRestaurantModalState();
}

class _AddRestaurantModalState extends State<AddRestaurantModal> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String _errorMessage = '';

  // Form fields
  final _nameController = TextEditingController();
  String _status = 'open';
  final _startWorkController = TextEditingController();
  final _endWorkController = TextEditingController();
  final _imageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _startWorkController.dispose();
    _endWorkController.dispose();
    _imageController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final deliveryProvider = Provider.of<DeliveryProvider>(
        context,
        listen: false,
      );
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);

      final token = guestProvider.guestData?.token;
      if (token == null) {
        throw Exception('Authentication required');
      }

      final success = await deliveryProvider.createRestaurant(
        restaurantName: _nameController.text.trim(),
        status: _status,
        startWork: _startWorkController.text.trim(),
        endWork: _endWorkController.text.trim(),
        restaurantImage: _imageController.text.trim().isNotEmpty
            ? _imageController.text.trim()
            : null,
      );

      if (success) {
        // Clear form
        _nameController.clear();
        _startWorkController.clear();
        _endWorkController.clear();
        _imageController.clear();
        _status = 'open';

        if (widget.onRestaurantAdded != null) {
          widget.onRestaurantAdded!();
        }

        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        setState(() {
          _errorMessage =
              deliveryProvider.errorMessage ?? 'Failed to create restaurant';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
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
                  'Add New Restaurant',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Error message
            if (_errorMessage.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 15),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
              ),

            // Restaurant Name
            const Text(
              'Restaurant Name',
              style: TextStyle(fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                hintText: 'Enter restaurant name',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Restaurant name is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Status
            const Text('Status', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: _status,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: 'open', child: Text('Open')),
                DropdownMenuItem(value: 'closed', child: Text('Closed')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _status = value;
                  });
                }
              },
            ),
            const SizedBox(height: 16),

            // Work Hours
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Start Time',
                        style: TextStyle(fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _startWorkController,
                        decoration: const InputDecoration(
                          hintText: 'HH:MM',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Start time is required';
                          }
                          // Simple time format validation
                          if (!RegExp(
                            r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                          ).hasMatch(value.trim())) {
                            return 'Invalid time format (HH:MM)';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'End Time',
                        style: TextStyle(fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _endWorkController,
                        decoration: const InputDecoration(
                          hintText: 'HH:MM',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'End time is required';
                          }
                          // Simple time format validation
                          if (!RegExp(
                            r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                          ).hasMatch(value.trim())) {
                            return 'Invalid time format (HH:MM)';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Image URL (optional)
            const Text(
              'Image URL (Optional)',
              style: TextStyle(fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _imageController,
              decoration: const InputDecoration(
                hintText: 'https://example.com/image.jpg',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text(
                        'Add Restaurant',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
