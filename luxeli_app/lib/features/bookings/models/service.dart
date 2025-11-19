class Service {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final String location;
  final DateTime availableDate;
  final DateTime startDate;
  final DateTime endDate;
  final String status; // "published" or "unpublished"

  Service({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    required this.location,
    required this.availableDate,
    required this.startDate,
    required this.endDate,
    required this.status,
  });

  // Create a Service from JSON (booking settings API response)
  factory Service.fromJson(Map<String, dynamic> json) {
    // Handle date parsing more robustly
    DateTime parseDate(dynamic dateValue) {
      if (dateValue == null) return DateTime.now();
      if (dateValue is String) {
        try {
          return DateTime.parse(dateValue);
        } catch (e) {
          return DateTime.now();
        }
      }
      if (dateValue is Map<String, dynamic> && dateValue.containsKey('\$date')) {
        // Handle MongoDB date format
        try {
          return DateTime.parse(dateValue['\$date']);
        } catch (e) {
          return DateTime.now();
        }
      }
      return DateTime.now();
    }

    return Service(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      name: json['serviceName'] as String? ?? '',
      description: json['serviceDescription'] as String? ?? '',
      price: (json['servicePrice'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['serviceImage'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      location: json['serviceLocation'] as String? ?? 'Hotel Lobby',
      availableDate: DateTime.now(), // This will be set based on context
      startDate: parseDate(json['startDate']),
      endDate: parseDate(json['endDate']),
      status: json['status'] as String? ?? 'unpublished',
    );
  }

  // Convert a Service to JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'serviceName': name,
      'serviceDescription': description,
      'servicePrice': price,
      'serviceImage': imageUrl,
      'category': category,
      'serviceLocation': location,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'status': status,
    };
  }
}

final List<Service> dummyServices = [
  Service(
    id: '1',
    name: 'Luxury Pool Access',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 20.0,
    imageUrl:
        'https://picsum.photos/seed/pool/400/300', // Using picsum as a reliable placeholder
    category: 'Leisure',
    location: 'Main Pool Area',
    availableDate: DateTime(2025, 1, 15),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '2',
    name: 'Spa & Wellness Package',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 0.0, // Example of a free service
    imageUrl:
        'https://picsum.photos/seed/spa/400/300', // Using picsum as a reliable placeholder
    category: 'Wellness',
    location: 'Spa Center',
    availableDate: DateTime(2025, 1, 20),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '3',
    name: 'Fine Dining Experience',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 50.0,
    imageUrl:
        'https://picsum.photos/seed/dining/400/300', // Using picsum as a reliable placeholder
    category: 'Dining',
    location: 'Rooftop Restaurant',
    availableDate: DateTime(2025, 2, 1),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
  Service(
    id: '4',
    name: 'Exclusive Party Night',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 20.0,
    imageUrl:
        'https://picsum.photos/seed/party/400/300', // Using picsum as a reliable placeholder
    category: 'Events',
    location: 'Grand Ballroom',
    availableDate: DateTime(2025, 2, 10),
    startDate: DateTime(2025, 1, 1),
    endDate: DateTime(2025, 12, 31),
    status: 'published',
  ),
];
