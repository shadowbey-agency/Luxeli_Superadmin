import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/features/laundry/screens/request_laundry_screen.dart';
import 'package:luxeli_app/features/laundry/widgets/laundry_request_details_modal.dart';

import '../models/laundry_request.dart';
import '../widgets/laundry_request_card.dart';

class LaundryScreen extends StatefulWidget {
  const LaundryScreen({super.key});

  @override
  State<LaundryScreen> createState() => _LaundryScreenState();
}

class _LaundryScreenState extends State<LaundryScreen> {
  final List<LaundryRequest> _laundryRequests = List.from(dummyLaundryRequests);

  void _addLaundryRequest(LaundryRequest request) {
    setState(() {
      _laundryRequests.insert(0, request); // Add new request to the top
    });
  }

  void _cancelLaundryRequest(String id) {
    setState(() {
      final index = _laundryRequests.indexWhere((req) => req.id == id);
      if (index != -1) {
        // Create a new LaundryRequest with canceled status instead of modifying directly
        final originalRequest = _laundryRequests[index];
        _laundryRequests[index] = LaundryRequest(
          id: originalRequest.id,
          partnerId: originalRequest.partnerId,
          service: originalRequest.service,
          roomName: originalRequest.roomName,
          residentialName: originalRequest.residentialName,
          services: originalRequest.services,
          piece: originalRequest.piece,
          pickup: originalRequest.pickup,
          status: LaundryStatus
              .canceled, // Fixed: changed from cancelled to canceled
          priority: originalRequest.priority,
          notes: originalRequest.notes,
          assignee: originalRequest.assignee,
          createdAt: originalRequest.createdAt,
          updatedAt: DateTime.now(),
        );
      }
    });
  }

  void _showRequestDetails(LaundryRequest request) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (context) {
        return LaundryRequestDetailsModal(
          request: request,
          onCancelRequest: () {
            _cancelLaundryRequest(request.id);
            Navigator.of(context).pop(); // Close modal
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Group requests by date
    final Map<String, List<LaundryRequest>> groupedRequests = {};
    for (var req in _laundryRequests) {
      String groupKey;
      if (DateUtils.isSameDay(req.pickup, DateTime.now())) {
        // Fixed: changed from requestDate to pickup
        groupKey = 'Today';
      } else if (DateUtils.isSameDay(
        req.pickup, // Fixed: changed from requestDate to pickup
        DateTime.now().subtract(const Duration(days: 1)),
      )) {
        groupKey = 'Yesterday';
      } else {
        groupKey = DateFormat(
          'dd MMMM yyyy',
        ).format(req.pickup); // Fixed: changed from requestDate to pickup
      }
      groupedRequests.putIfAbsent(groupKey, () => []).add(req);
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.grey[50],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          'Laundry',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            children: [
              SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight:
                        constraints.maxHeight -
                        kToolbarHeight -
                        MediaQuery.of(context).padding.top,
                  ),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Laundry service',
                                      style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Keep your clothes fresh and clean. Choose the service you need.',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 20),
                              // Washing machine image with constrained size and reliable placeholder
                              Flexible(
                                child: Image.network(
                                  'https://picsum.photos/seed/laundry/100/100', // Using picsum as a reliable placeholder
                                  height: 80,
                                  width: 80,
                                  fit: BoxFit.contain,
                                  errorBuilder: (context, error, stackTrace) {
                                    // Fallback icon if image fails to load
                                    return Container(
                                      height: 80,
                                      width: 80,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        Icons.local_laundry_service,
                                        size: 40,
                                        color: Colors.grey[600],
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (_laundryRequests.isEmpty)
                          Center(
                            child: Column(
                              children: [
                                const SizedBox(height: 40),
                                Container(
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    Icons.opacity, // Water drop icon
                                    size: 40,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'No requests available',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          )
                        else
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20.0,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      const Text(
                                        'Requests',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.filter_list),
                                        onPressed: () {
                                          // Handle filter
                                        },
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Expanded(
                                    child: ListView(
                                      children: groupedRequests.entries
                                          .expand(
                                            (entry) => [
                                              Padding(
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                      vertical: 8.0,
                                                    ),
                                                child: Text(
                                                  entry.key,
                                                  style: const TextStyle(
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              ...entry.value.map(
                                                (request) => LaundryRequestCard(
                                                  request: request,
                                                  onViewDetails: () =>
                                                      _showRequestDetails(
                                                        request,
                                                      ),
                                                  onCancelRequest: () =>
                                                      _cancelLaundryRequest(
                                                        request.id,
                                                      ),
                                                ),
                                              ),
                                            ],
                                          )
                                          .toList(),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        const SizedBox(
                          height: 100,
                        ), // Space for the fixed bottom button
                      ],
                    ),
                  ),
                ),
              ),
              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => RequestLaundryScreen(
                              onLaundryRequestAdded: _addLaundryRequest,
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0D47A1), // Dark blue
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text(
                        'Add new request',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
