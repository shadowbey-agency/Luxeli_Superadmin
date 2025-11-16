import 'package:flutter/material.dart';

class BookingScreen extends StatefulWidget {
  final String image;
  final String name;
  final String description;
  final String price;

  const BookingScreen({
    super.key,
    required this.image,
    required this.name,
    required this.description,
    required this.price,
  });

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  late DateTime selectedDate;
  late TimeOfDay selectedTime;
  final TextEditingController _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now().add(const Duration(days: 1));
    selectedTime = const TimeOfDay(hour: 9, minute: 0);
  }

  Future<void> _pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  Future<void> _pickTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: selectedTime,
    );
    if (picked != null && picked != selectedTime) {
      setState(() {
        selectedTime = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Text(
                    'Request service',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Description text
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Browse our available options and pick the one that suits your needs',
                style: TextStyle(color: Colors.grey),
              ),
            ),
            const SizedBox(height: 24),

            // Progress indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFFEAF1FB),
                    ),
                    child: Center(
                      child: Text(
                        '2/2',
                        style: TextStyle(
                          color: Color(0xFF0A3B78),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Confirm your request details',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Check your service details and complete your request.',
                style: TextStyle(color: Colors.grey),
              ),
            ),
            const SizedBox(height: 16),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Service summary card
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(color: Colors.black12, blurRadius: 4),
                          ],
                        ),
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.asset(
                                widget.image,
                                width: 60,
                                height: 60,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    widget.description,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              '\$${widget.price}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0A3B78),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Schedule section
                      const Text(
                        'Schedule section',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              readOnly: true,
                              decoration: InputDecoration(
                                labelText: 'Date',
                                suffixIcon: Icon(Icons.calendar_today),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              controller: TextEditingController(
                                text:
                                    '${selectedDate.day.toString().padLeft(2, '0')}/${selectedDate.month.toString().padLeft(2, '0')}/${selectedDate.year}',
                              ),
                              onTap: _pickDate,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              readOnly: true,
                              decoration: InputDecoration(
                                labelText: 'Time',
                                suffixIcon: Icon(Icons.access_time),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              controller: TextEditingController(
                                text: selectedTime.format(context),
                              ),
                              onTap: _pickTime,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Additional notes
                      const Text(
                        'Additional notes',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _notesController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Note',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                            showDialog(
                              context: context,
                              builder: (_) => _RequestDetailsModal(
                                service: 'Booking',
                                id: '15654',
                                requestDate:
                                    '${selectedDate.day.toString().padLeft(2, '0')}/${selectedDate.month.toString().padLeft(2, '0')}/${selectedDate.year} ${selectedTime.format(context)}',
                                statusList: [
                                  {
                                    'date':
                                        '${selectedDate.day.toString().padLeft(2, '0')}/${selectedDate.month.toString().padLeft(2, '0')}/${selectedDate.year} ${selectedTime.format(context)}',
                                    'status': 'Pending',
                                  },
                                  {
                                    'date':
                                        '${selectedDate.day.toString().padLeft(2, '0')}/${selectedDate.month.toString().padLeft(2, '0')}/${selectedDate.year} ${selectedTime.format(context)}',
                                    'status': 'Accepted',
                                  },
                                ],
                                image: widget.image,
                                name: widget.name,
                                description: widget.description,
                                price: widget.price,
                                scheduleDate:
                                    '${selectedDate.day.toString().padLeft(2, '0')}/${selectedDate.month.toString().padLeft(2, '0')}/${selectedDate.year}',
                                scheduleTime: selectedTime.format(context),
                                notes: _notesController.text,
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0A3B78),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Send request',
                            style: TextStyle(
                              fontSize: 16,
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
            ),
          ],
        ),
      ),
    );
  }
}

class _RequestDetailsModal extends StatelessWidget {
  final String service;
  final String id;
  final String requestDate;
  final List<Map<String, String>> statusList;
  final String image;
  final String name;
  final String description;
  final String price;
  final String scheduleDate;
  final String scheduleTime;
  final String notes;

  const _RequestDetailsModal({
    required this.service,
    required this.id,
    required this.requestDate,
    required this.statusList,
    required this.image,
    required this.name,
    required this.description,
    required this.price,
    required this.scheduleDate,
    required this.scheduleTime,
    required this.notes,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Request details',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Request info
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Request info',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Icon(Icons.expand_more, color: Colors.grey),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Service', style: TextStyle(color: Colors.grey)),
                        Text(
                          service,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('ID', style: TextStyle(color: Colors.grey)),
                        Text(id, style: TextStyle(fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Request Date',
                          style: TextStyle(color: Colors.grey),
                        ),
                        Text(
                          requestDate,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text('Status', style: TextStyle(color: Colors.grey)),
                    ...statusList.map(
                      (status) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              status['date'] ?? '',
                              style: TextStyle(color: Colors.grey),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: status['status'] == 'Pending'
                                    ? Color(0xFFF8F1E6)
                                    : Color(0xFFEAF1FB),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                status['status'] ?? '',
                                style: TextStyle(
                                  color: status['status'] == 'Pending'
                                      ? Color(0xFFB98B5A)
                                      : Color(0xFF0A3B78),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Service details
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Service details',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Icon(Icons.expand_more, color: Colors.grey),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.asset(
                            image,
                            width: 60,
                            height: 60,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                description,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '\$$price',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0A3B78),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Schedule Date',
                          style: TextStyle(color: Colors.grey),
                        ),
                        Text(
                          scheduleDate,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Schedule Time',
                          style: TextStyle(color: Colors.grey),
                        ),
                        Text(
                          scheduleTime,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Additional Notes',
                      style: TextStyle(color: Colors.grey),
                    ),
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(top: 4),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Color(0xFFF8F8F8),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        notes,
                        style: TextStyle(color: Colors.black87),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
