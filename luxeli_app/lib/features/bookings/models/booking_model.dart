class Booking {
  final String id;
  final String serviceId;
  final String serviceName;
  final String serviceImage;
  final String serviceDescription;
  final double price;
  final DateTime bookingDate;
  final String timeSlot;
  final String customerNotes;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Booking({
    required this.id,
    required this.serviceId,
    required this.serviceName,
    required this.serviceImage,
    required this.serviceDescription,
    required this.price,
    required this.bookingDate,
    required this.timeSlot,
    required this.customerNotes,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  // Create a Booking from JSON
  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String,
      serviceId: json['serviceId'] as String,
      serviceName: json['serviceName'] as String,
      serviceImage: json['serviceImage'] as String,
      serviceDescription: json['serviceDescription'] as String,
      price: (json['price'] as num).toDouble(),
      bookingDate: DateTime.parse(json['bookingDate'] as String),
      timeSlot: json['timeSlot'] as String,
      customerNotes: json['customerNotes'] as String,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  // Convert a Booking to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'serviceId': serviceId,
      'serviceName': serviceName,
      'serviceImage': serviceImage,
      'serviceDescription': serviceDescription,
      'price': price,
      'bookingDate': bookingDate.toIso8601String(),
      'timeSlot': timeSlot,
      'customerNotes': customerNotes,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}