import 'package:flutter/material.dart';
import 'package:luxeli_app/features/bookings/widgets/circular_progress_indicator_with_text.dart';
import 'package:uuid/uuid.dart'; // For generating unique IDs

import '../models/laundry_item.dart';
import '../models/laundry_request.dart';
import '../widgets/laundry_service_chip.dart';

class RequestLaundryScreen extends StatefulWidget {
  final Function(LaundryRequest) onLaundryRequestAdded;

  const RequestLaundryScreen({super.key, required this.onLaundryRequestAdded});

  @override
  State<RequestLaundryScreen> createState() => _RequestLaundryScreenState();
}

class _RequestLaundryScreenState extends State<RequestLaundryScreen> {
  int _currentStep = 1;
  final List<LaundryItem> _selectedServices = [];
  int _numberOfUnits = 1;
  String _selectedPickupOption = 'Today';
  LaundryPriority _selectedPriority = LaundryPriority.medium;
  final TextEditingController _notesController = TextEditingController();

  final List<String> _pickupOptions = ['Today', 'Tomorrow', 'In 2 Days'];
  final List<LaundryPriority> _priorityOptions = [
    LaundryPriority.low,
    LaundryPriority.medium,
    LaundryPriority.urgent,
  ];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _toggleServiceSelection(LaundryItem service) {
    setState(() {
      if (_selectedServices.contains(service)) {
        _selectedServices.remove(service);
      } else {
        _selectedServices.add(service);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          _currentStep == 1 ? 'Request Laundry' : 'Confirm Request',
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: _currentStep == 1 ? _buildStep1() : _buildStep2(),
    );
  }

  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Choose your laundry services',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Select the services you need and specify the number of items.',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              const CircularProgressIndicatorWithText(
                currentStep: 1,
                totalSteps: 2,
                radius: 20,
                strokeWidth: 2,
                progressColor: Color(0xFF0D47A1),
                backgroundColor: Colors.grey,
                textStyle: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0D47A1),
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select your services',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12.0,
                  mainAxisSpacing: 12.0,
                  childAspectRatio: 1.0,
                ),
                itemCount: dummyLaundryItems.length,
                itemBuilder: (context, index) {
                  final service = dummyLaundryItems[index];
                  return LaundryServiceChip(
                    service: service,
                    isSelected: _selectedServices.contains(service),
                    onTap: () => _toggleServiceSelection(service),
                  );
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Number of Units',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      initialValue: _numberOfUnits.toString(),
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Units',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _numberOfUnits = int.tryParse(value) ?? 1;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove, color: Colors.black),
                          onPressed: () {
                            setState(() {
                              if (_numberOfUnits > 1) _numberOfUnits--;
                            });
                          },
                        ),
                        Text(
                          '$_numberOfUnits',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, color: Colors.black),
                          onPressed: () {
                            setState(() {
                              _numberOfUnits++;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text(
                'Pick up',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedPickupOption,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
                items: _pickupOptions.map<DropdownMenuItem<String>>((
                  String value,
                ) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedPickupOption = newValue!;
                  });
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Priority',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<LaundryPriority>(
                initialValue: _selectedPriority,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
                items: _priorityOptions.map<DropdownMenuItem<LaundryPriority>>((
                  LaundryPriority value,
                ) {
                  return DropdownMenuItem<LaundryPriority>(
                    value: value,
                    child: Text(
                      value.toString().split('.').last,
                    ), // e.g., "normal"
                  );
                }).toList(),
                onChanged: (LaundryPriority? newValue) {
                  setState(() {
                    _selectedPriority = newValue!;
                  });
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Additional notes',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: 'Note',
                  hintText:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit int',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        ),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _selectedServices.isNotEmpty && _numberOfUnits > 0
                  ? () {
                      setState(() {
                        _currentStep = 2;
                      });
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D47A1),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Continue', style: TextStyle(fontSize: 16)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Confirm your laundry request',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Review your request details before submitting.',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              const CircularProgressIndicatorWithText(
                currentStep: 2,
                totalSteps: 2,
                radius: 20,
                strokeWidth: 2,
                progressColor: Color(0xFF0D47A1),
                backgroundColor: Colors.grey,
                textStyle: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0D47A1),
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Selected Services',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ..._selectedServices.map(
                (service) => Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Icon(service.icon, color: const Color(0xFF0D47A1)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                service.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                service.description,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '\$${service.price.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0D47A1),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Request Details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildDetailRow('Number of Units', '$_numberOfUnits'),
                      _buildDetailRow('Pickup Date', _selectedPickupOption),
                      _buildDetailRow(
                        'Priority',
                        _selectedPriority.toString().split('.').last,
                      ),
                      if (_notesController.text.isNotEmpty)
                        _buildDetailRow('Notes', _notesController.text),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    // Calculate pickup date based on selected option
                    DateTime pickupDate = DateTime.now();
                    if (_selectedPickupOption == 'Tomorrow') {
                      pickupDate = pickupDate.add(const Duration(days: 1));
                    } else if (_selectedPickupOption == 'In 2 Days') {
                      pickupDate = pickupDate.add(const Duration(days: 2));
                    }

                    final newRequest = LaundryRequest(
                      id: const Uuid().v4().substring(
                        0,
                        5,
                      ), // Generate a short ID
                      partnerId:
                          'partner1', // Placeholder - should be actual partner ID
                      service: 'laundry', // Fixed field name
                      roomName:
                          'Room 101', // Placeholder - should be actual room name
                      residentialName:
                          'Building A', // Placeholder - should be actual residential name
                      services: _selectedServices
                          .map((item) => item.id)
                          .toList(), // Fixed field name and mapping
                      piece: _numberOfUnits, // Fixed field name
                      pickup: pickupDate,
                      status: LaundryStatus.newStatus,
                      priority: _selectedPriority,
                      notes: _notesController.text.isNotEmpty
                          ? _notesController.text
                          : null,
                      createdAt: DateTime.now(),
                      updatedAt: DateTime.now(),
                    );

                    // Call the callback to add the request
                    widget.onLaundryRequestAdded(newRequest);

                    // Show success message and navigate back
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Laundry request submitted successfully!',
                        ),
                        backgroundColor: Colors.green,
                      ),
                    );
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D47A1),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Confirm Request',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(fontSize: 16, color: Colors.grey[700]),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
