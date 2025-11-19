import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// Match backend enum values
enum LaundryStatus {
  newStatus, // 'new' in backend
  accepted,
  completed,
  noShow, // 'no-show' in backend
  canceled,
}

enum LaundryPriority { low, medium, urgent }

class LaundryRequest {
  final String id;
  final String partnerId;
  final String service;
  final String roomName;
  final String residentialName;
  final List<String>
  services; // Changed from LaundryItem to String to match backend
  final int piece;
  final DateTime pickup;
  final LaundryStatus status;
  final LaundryPriority priority;
  final String? notes;
  final Assignee? assignee;
  final DateTime createdAt;
  final DateTime updatedAt;

  LaundryRequest({
    required this.id,
    required this.partnerId,
    required this.service,
    required this.roomName,
    required this.residentialName,
    required this.services,
    required this.piece,
    required this.pickup,
    required this.status,
    required this.priority,
    this.notes,
    this.assignee,
    required this.createdAt,
    required this.updatedAt,
  });

  // Create a LaundryRequest from JSON (backend API response)
  factory LaundryRequest.fromJson(Map<String, dynamic> json) {
    // Debug information
    print('Parsing LaundryRequest from JSON: $json');

    // Helper functions for safe parsing
    String getString(dynamic value, [String fallback = '']) {
      if (value == null) return fallback;
      if (value is String) return value;
      return fallback;
    }

    int getInt(dynamic value, [int fallback = 0]) {
      if (value == null) return fallback;
      if (value is int) return value;
      if (value is num) return value.toInt();
      return fallback;
    }

    DateTime parseDate(dynamic dateValue) {
      if (dateValue == null) {
        print('Date value is null, using current date');
        return DateTime.now();
      }
      if (dateValue is String) {
        try {
          print('Parsing date string: $dateValue');
          return DateTime.parse(dateValue);
        } catch (e) {
          print('Error parsing date string: $e, using current date');
          return DateTime.now();
        }
      }
      if (dateValue is Map<String, dynamic> &&
          dateValue.containsKey('\$date')) {
        try {
          print('Parsing date object: ${dateValue['\$date']}');
          return DateTime.parse(dateValue['\$date']);
        } catch (e) {
          print('Error parsing date object: $e, using current date');
          return DateTime.now();
        }
      }
      print('Unknown date format, using current date');
      return DateTime.now();
    }

    // Parse status enum
    LaundryStatus parseStatus(String? status) {
      print('Parsing status: $status');
      switch (status) {
        case 'new':
          return LaundryStatus.newStatus;
        case 'accepted':
          return LaundryStatus.accepted;
        case 'completed':
          return LaundryStatus.completed;
        case 'no-show':
          return LaundryStatus.noShow;
        case 'canceled':
          return LaundryStatus.canceled;
        default:
          print('Unknown status, using newStatus');
          return LaundryStatus.newStatus;
      }
    }

    // Parse priority enum
    LaundryPriority parsePriority(String? priority) {
      print('Parsing priority: $priority');
      switch (priority) {
        case 'low':
          return LaundryPriority.low;
        case 'medium':
          return LaundryPriority.medium;
        case 'urgent':
          return LaundryPriority.urgent;
        default:
          print('Unknown priority, using medium');
          return LaundryPriority.medium;
      }
    }

    final id = getString(json['_id'] ?? json['id']);
    print('Parsed ID: $id');

    final partnerId = getString(json['partnerId']);
    print('Parsed partnerId: $partnerId');

    final service = getString(json['service'], 'laundry');
    print('Parsed service: $service');

    final roomName = getString(json['roomName']);
    print('Parsed roomName: $roomName');

    final residentialName = getString(json['residentialName']);
    print('Parsed residentialName: $residentialName');

    final services =
        (json['services'] as List?)?.map((e) => e.toString()).toList() ?? [];
    print('Parsed services: $services');

    final piece = getInt(json['piece']);
    print('Parsed piece: $piece');

    final pickup = parseDate(json['pickup']);
    print('Parsed pickup: $pickup');

    final status = parseStatus(getString(json['status']));
    print('Parsed status: $status');

    final priority = parsePriority(getString(json['priority']));
    print('Parsed priority: $priority');

    final notes = getString(json['notes']);
    print('Parsed notes: $notes');

    final assignee = json['assigne'] != null
        ? Assignee.fromJson(json['assigne'] as Map<String, dynamic>)
        : null;
    print('Parsed assignee: $assignee');

    final createdAt = parseDate(json['createdAt']);
    print('Parsed createdAt: $createdAt');

    final updatedAt = parseDate(json['updatedAt']);
    print('Parsed updatedAt: $updatedAt');

    return LaundryRequest(
      id: id,
      partnerId: partnerId,
      service: service,
      roomName: roomName,
      residentialName: residentialName,
      services: services,
      piece: piece,
      pickup: pickup,
      status: status,
      priority: priority,
      notes: notes,
      assignee: assignee,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Convert a LaundryRequest to JSON
  Map<String, dynamic> toJson() {
    // Convert status enum to string
    String statusToString() {
      switch (status) {
        case LaundryStatus.newStatus:
          return 'new';
        case LaundryStatus.accepted:
          return 'accepted';
        case LaundryStatus.completed:
          return 'completed';
        case LaundryStatus.noShow:
          return 'no-show';
        case LaundryStatus.canceled:
          return 'canceled';
      }
    }

    // Convert priority enum to string
    String priorityToString() {
      switch (priority) {
        case LaundryPriority.low:
          return 'low';
        case LaundryPriority.medium:
          return 'medium';
        case LaundryPriority.urgent:
          return 'urgent';
      }
    }

    return {
      '_id': id,
      'partnerId': partnerId,
      'service': service,
      'roomName': roomName,
      'residentialName': residentialName,
      'services': services,
      'piece': piece,
      'pickup': pickup.toIso8601String(),
      'status': statusToString(),
      'priority': priorityToString(),
      'notes': notes,
      'assigne': assignee?.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  String get formattedDate => DateFormat('dd/MM/yyyy').format(pickup);
  String get formattedTime => DateFormat('HH:mm a').format(pickup);

  String get statusText {
    switch (status) {
      case LaundryStatus.newStatus:
        return 'New';
      case LaundryStatus.accepted:
        return 'Accepted';
      case LaundryStatus.completed:
        return 'Completed';
      case LaundryStatus.noShow:
        return 'No Show';
      case LaundryStatus.canceled:
        return 'Canceled';
    }
  }

  Color get statusColor {
    switch (status) {
      case LaundryStatus.newStatus:
        return Colors.orange;
      case LaundryStatus.accepted:
        return Colors.blue;
      case LaundryStatus.completed:
        return Colors.green;
      case LaundryStatus.noShow:
        return Colors.grey;
      case LaundryStatus.canceled:
        return Colors.red;
    }
  }

  String get priorityText {
    switch (priority) {
      case LaundryPriority.low:
        return 'Low';
      case LaundryPriority.medium:
        return 'Medium';
      case LaundryPriority.urgent:
        return 'Urgent';
    }
  }

  String get servicesSummary {
    return services.join(', ');
  }
}

class Assignee {
  final String name;
  final String staffId;
  final String? profilePic;

  Assignee({required this.name, required this.staffId, this.profilePic});

  factory Assignee.fromJson(Map<String, dynamic> json) {
    return Assignee(
      name: json['name'] as String? ?? '',
      staffId: json['staffId'] as String? ?? '',
      profilePic: json['profilePic'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'staffId': staffId, 'profilePic': profilePic};
  }
}

// Dummy data for demonstration
final List<LaundryRequest> dummyLaundryRequests = [
  LaundryRequest(
    id: '1',
    partnerId: 'partner1',
    service: 'laundry',
    roomName: 'Room 101',
    residentialName: 'Building A',
    services: ['wash', 'iron'],
    piece: 3,
    pickup: DateTime.now().add(const Duration(hours: 2)),
    status: LaundryStatus.newStatus,
    priority: LaundryPriority.medium,
    notes: 'Please use gentle cycle',
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
    updatedAt: DateTime.now().subtract(const Duration(hours: 12)),
  ),
  LaundryRequest(
    id: '2',
    partnerId: 'partner1',
    service: 'laundry',
    roomName: 'Room 205',
    residentialName: 'Building B',
    services: ['dry cleaning'],
    piece: 2,
    pickup: DateTime.now().add(const Duration(days: 1)),
    status: LaundryStatus.accepted,
    priority: LaundryPriority.urgent,
    notes: 'Delicate items',
    assignee: Assignee(name: 'John Doe', staffId: 'staff123'),
    createdAt: DateTime.now().subtract(const Duration(days: 2)),
    updatedAt: DateTime.now().subtract(const Duration(days: 1)),
  ),
];
