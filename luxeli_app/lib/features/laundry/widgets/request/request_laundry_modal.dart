import 'package:flutter/material.dart';

class RequestLaundryModal extends StatefulWidget {
  const RequestLaundryModal({super.key});

  @override
  State<RequestLaundryModal> createState() => _RequestLaundryModalState();
}

class _RequestLaundryModalState extends State<RequestLaundryModal> {
  int selectedService = 0;
  int units = 1;
  String pickupDay = 'Today';
  String priority = 'Normal';

  final List<Map<String, dynamic>> services = [
    {'icon': Icons.local_laundry_service, 'label': 'Wash'},
    {'icon': Icons.checkroom, 'label': 'Wash & Iron'},
    {'icon': Icons.dry_cleaning, 'label': 'Dry Cleaning'},
    {'icon': Icons.bathtub, 'label': 'Duvets'},
    {'icon': Icons.directions_run, 'label': 'Shoes'},
    {'icon': Icons.grid_view, 'label': 'Other'},
  ];

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      insetPadding: const EdgeInsets.all(16),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(0, 24, 0, 0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(width: 40),
                    const Text(
                      'Request laundry',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Choose your preferred service and let us handle the rest.',
                  style: TextStyle(color: Colors.grey),
                ),
              ),
              const SizedBox(height: 16),
              const Divider(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Select your services', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 16),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        childAspectRatio: 1.2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: services.length,
                      itemBuilder: (context, index) {
                        final service = services[index];
                        final selected = selectedService == index;
                        return GestureDetector(
                          onTap: () => setState(() => selectedService = index),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: selected ? const Color(0xFF0A3B78) : const Color(0xFFEAEAEA),
                                width: selected ? 2 : 1,
                              ),
                              boxShadow: [if (selected) BoxShadow(color: Color(0x220A3B78), blurRadius: 4)],
                            ),
                            child: Stack(
                              children: [
                                Center(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(service['icon'], size: 32, color: const Color(0xFF0A3B78)),
                                      const SizedBox(height: 8),
                                      Text(service['label'], style: const TextStyle(fontWeight: FontWeight.w500)),
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 8,
                                  right: 8,
                                  child: selected
                                      ? Container(
                                          width: 20,
                                          height: 20,
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            border: Border.all(color: Color(0xFF0A3B78), width: 2),
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(Icons.check, size: 14, color: Color(0xFF0A3B78)),
                                        )
                                      : Container(
                                          width: 20,
                                          height: 20,
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            border: Border.all(color: Color(0xFFEAEAEA), width: 1),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Number of Units', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F8F8),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Color(0xFFEAEAEA)),
                      ),
                      child: Row(
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 12),
                            child: Text('Units', style: TextStyle(color: Colors.grey)),
                          ),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.remove),
                            onPressed: () => setState(() { if (units > 1) units--; }),
                          ),
                          Text(units.toString().padLeft(2, '0'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () => setState(() { units++; }),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Pick up', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F8F8),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Color(0xFFEAEAEA)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: pickupDay,
                          items: ['Today', 'Tomorrow', 'Pick a date']
                              .map((e) => DropdownMenuItem(value: e, child: Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text(e))))
                              .toList(),
                          onChanged: (val) => setState(() { pickupDay = val!; }),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F8F8),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Color(0xFFEAEAEA)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: priority,
                          items: ['Normal', 'Urgent']
                              .map((e) => DropdownMenuItem(value: e, child: Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text(e))))
                              .toList(),
                          onChanged: (val) => setState(() { priority = val!; }),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // TODO: Handle send request action
                      Navigator.of(context).pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0A3B78),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Send request', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16)),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
