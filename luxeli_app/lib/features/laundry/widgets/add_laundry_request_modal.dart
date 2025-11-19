import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/laundry/providers/laundry_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/laundry/widgets/laundry_service_card.dart';

class AddLaundryRequestModal extends StatefulWidget {
  final VoidCallback onLaundryAdded;

  const AddLaundryRequestModal({super.key, required this.onLaundryAdded});

  @override
  State<AddLaundryRequestModal> createState() => _AddLaundryRequestModalState();
}

class _AddLaundryRequestModalState extends State<AddLaundryRequestModal> {
  final _formKey = GlobalKey<FormState>();
  final _notesController = TextEditingController();

  // Define laundry services with icons and map to backend enum values
  final List<Map<String, dynamic>> _laundryServices = [
    {
      'icon': Icons.local_laundry_service,
      'label': 'Wash & Fold',
      'value': 'wash',
    },
    {'icon': Icons.checkroom, 'label': 'Wash & Iron', 'value': 'wash&iron'},
    {
      'icon': Icons.dry_cleaning,
      'label': 'Dry Cleaning',
      'value': 'dry cleaning',
    },
    {'icon': Icons.directions_run, 'label': 'Shoes', 'value': 'shoes'},
    {'icon': Icons.bathtub, 'label': 'Duvets', 'value': 'duvets'},
    {'icon': Icons.grid_view, 'label': 'Other', 'value': 'others'},
  ];

  List<String> _selectedServices = [];
  int _pieceCount = 1;
  DateTime _pickupDate = DateTime.now();
  TimeOfDay _pickupTime = TimeOfDay.now();
  String? _priority;
  bool _isLoading = false;
  String _errorMessage = '';

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _pickupDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null && picked != _pickupDate) {
      setState(() {
        _pickupDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _pickupTime,
    );
    if (picked != null && picked != _pickupTime) {
      setState(() {
        _pickupTime = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);
      final laundryProvider = Provider.of<LaundryProvider>(
        context,
        listen: false,
      );

      final token = guestProvider.guestData?.token;
      final roomName = guestProvider.guestData?.roomName;
      if (token == null) {
        throw Exception('Authentication token not found');
      }

      if (roomName == null) {
        throw Exception('Room information not found');
      }

      // Map selected service labels to backend enum values
      final List<String> backendServices = _selectedServices.map<String>((
        label,
      ) {
        final service = _laundryServices.firstWhere(
          (s) => s['label'] == label,
          orElse: () => {'value': 'others'},
        );
        return service['value'] as String;
      }).toList();

      final success = await laundryProvider.addRequest(
        residentialName: roomName,
        services: backendServices, // Use mapped backend values
        piece: _pieceCount,
        pickup: DateTime(
          _pickupDate.year,
          _pickupDate.month,
          _pickupDate.day,
          _pickupTime.hour,
          _pickupTime.minute,
        ),
        priority: _priority,
        notes: _notesController.text,
      );

      if (!success) {
        throw Exception(
          laundryProvider.errorMessage ?? 'Failed to create laundry request',
        );
      }
      widget.onLaundryAdded();
      if (mounted) Navigator.of(context).pop();
    } catch (error) {
      setState(() {
        _errorMessage = error.toString();
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
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Add Laundry Request',
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

              // Services
              const Text(
                'Services',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              // Replace the Container with CheckboxListTile with this GridView
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  childAspectRatio: 0.85,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: _laundryServices.length,
                itemBuilder: (context, index) {
                  final service = _laundryServices[index];
                  final isSelected = _selectedServices.contains(
                    service['label'],
                  );

                  return LaundryServiceCard(
                    icon: service['icon'],
                    title: service['label'],
                    isSelected: isSelected,
                    onTap: () {
                      setState(() {
                        if (isSelected) {
                          _selectedServices.remove(service['label']);
                        } else {
                          _selectedServices.add(service['label']);
                        }
                      });
                    },
                  );
                },
              ),
              const SizedBox(height: 16),

              // Piece Count
              const Text(
                'Number of Pieces',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.remove),
                    onPressed: _pieceCount > 1
                        ? () => setState(() => _pieceCount--)
                        : null,
                  ),
                  Text('$_pieceCount', style: const TextStyle(fontSize: 18)),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () => setState(() => _pieceCount++),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Pickup Date and Time
              const Text(
                'Pickup Date & Time',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectDate(context),
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        child: Text(
                          '${_pickupDate.day}/${_pickupDate.month}/${_pickupDate.year}',
                          style: const TextStyle(color: Colors.black),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectTime(context),
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        child: Text(
                          _pickupTime.format(context),
                          style: const TextStyle(color: Colors.black),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Priority
              const Text(
                'Priority (Optional)',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _priority,
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: null, child: Text('Select Priority')),
                  DropdownMenuItem(value: 'low', child: Text('Low')),
                  DropdownMenuItem(value: 'medium', child: Text('Medium')),
                  DropdownMenuItem(value: 'urgent', child: Text('Urgent')),
                ],
                onChanged: (value) {
                  setState(() {
                    _priority = value;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Notes
              const Text(
                'Notes (Optional)',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _notesController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Any special instructions...',
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
                          'Submit Request',
                          style: TextStyle(fontSize: 16),
                        ),
                ),
              ),
              const SizedBox(height: 20), // Add some bottom padding
            ],
          ),
        ),
      ),
    );
  }
}
