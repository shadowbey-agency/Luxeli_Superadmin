class HousekeepingRequest {
  final String id;
  final String serviceType;
  final DateTime requestTime;
  final String status; // e.g., 'Pending', 'Completed', 'Cancelled'
  final String? notes; // Added notes field
  final String? imageUrl; // URL for item image
  final Map<String, int>?
  items; // items and their quantities for 'Items needed' requests

  HousekeepingRequest({
    required this.id,
    required this.serviceType,
    required this.requestTime,
    this.status = 'Pending',
    this.notes, // Initialize notes
    this.imageUrl, // Initialize image URL
    this.items,
  });

  HousekeepingRequest copyWith({
    String? id,
    String? serviceType,
    DateTime? requestTime,
    String? status,
    String? notes, // Add notes to copyWith
    String? imageUrl, // Add imageUrl to copyWith
    Map<String, int>? items,
  }) {
    return HousekeepingRequest(
      id: id ?? this.id,
      serviceType: serviceType ?? this.serviceType,
      requestTime: requestTime ?? this.requestTime,
      status: status ?? this.status,
      notes: notes ?? this.notes, // Copy notes
      imageUrl: imageUrl ?? this.imageUrl, // Copy imageUrl
      items: items ?? this.items,
    );
  }
}
