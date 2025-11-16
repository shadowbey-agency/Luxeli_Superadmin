/// Represents a service request made by a user
enum RequestStatus {
  /// Request has been submitted but not yet completed
  pending,

  /// Request has been successfully completed
  completed,

  /// Request has been cancelled by user or system
  cancelled,
}

/// Types of services that can be requested
enum RequestType {
  /// Housekeeping/cleaning services
  housekeeping,

  /// Laundry and clothing care services
  laundry,

  /// Item delivery services
  delivery,

  /// Room service requests
  roomService,

  /// Maintenance and repair requests
  maintenance,
}

/// Model representing a user's service request
class RequestModel {
  /// Unique identifier for the request
  final String id;

  /// Type of service requested
  final RequestType type;

  /// Current status of the request
  final RequestStatus status;

  /// Date and time when the request was made
  final DateTime date;

  /// Specific details about the type of housekeeping request
  final String? requestTypeDetail;

  /// Specific service type for laundry requests
  final String? service;

  /// Number of items for laundry or delivery requests
  final int? itemCount;

  /// Location for pickup/delivery requests
  final String? pickupLocation;

  /// Whether this request was made today
  final bool isToday;

  RequestModel({
    required this.id,
    required this.type,
    required this.status,
    required this.date,
    this.requestTypeDetail,
    this.service,
    this.itemCount,
    this.pickupLocation,
    this.isToday = false,
  });

  /// Get human-readable status text
  String get statusText {
    switch (status) {
      case RequestStatus.pending:
        return 'Pending';
      case RequestStatus.completed:
        return 'Completed';
      case RequestStatus.cancelled:
        return 'Cancelled';
    }
  }

  /// Get human-readable type text
  String get typeText {
    switch (type) {
      case RequestType.housekeeping:
        return 'Housekeeping';
      case RequestType.laundry:
        return 'Laundry';
      case RequestType.delivery:
        return 'Delivery';
      case RequestType.roomService:
        return 'Room Service';
      case RequestType.maintenance:
        return 'Maintenance';
    }
  }

  /// Get icon path for the request type
  String get iconPath {
    switch (type) {
      case RequestType.housekeeping:
        return 'assets/icons/housekeeping.svg';
      case RequestType.laundry:
        return 'assets/icons/laundry.svg';
      case RequestType.delivery:
        return 'assets/icons/delivery.svg';
      case RequestType.roomService:
        return 'assets/icons/room_service.svg';
      case RequestType.maintenance:
        return 'assets/icons/maintenance.svg';
    }
  }

  /// Get all request details as a map for display
  Map<String, String> getDetailsMap() {
    switch (type) {
      case RequestType.housekeeping:
        return {'Request type': requestTypeDetail ?? 'Standard cleaning'};
      case RequestType.laundry:
        return {
          'Service': service ?? 'Standard wash',
          'Items': 'x${itemCount ?? 0}',
        };
      case RequestType.delivery:
        return {
          'Pick up': pickupLocation ?? 'Room',
          'Items': 'x${itemCount ?? 0}',
        };
      default:
        return {};
    }
  }

  /// Create a copy of this request with updated values
  RequestModel copyWith({
    String? id,
    RequestType? type,
    RequestStatus? status,
    DateTime? date,
    String? requestTypeDetail,
    String? service,
    int? itemCount,
    String? pickupLocation,
    bool? isToday,
  }) {
    return RequestModel(
      id: id ?? this.id,
      type: type ?? this.type,
      status: status ?? this.status,
      date: date ?? this.date,
      requestTypeDetail: requestTypeDetail ?? this.requestTypeDetail,
      service: service ?? this.service,
      itemCount: itemCount ?? this.itemCount,
      pickupLocation: pickupLocation ?? this.pickupLocation,
      isToday: isToday ?? this.isToday,
    );
  }
}

/// Filter options for requests
class RequestFilter {
  /// Filter by service type
  final RequestType? serviceType;

  /// Filter by request status
  final RequestStatus? status;

  /// Filter by specific date
  final DateTime? date;

  RequestFilter({this.serviceType, this.status, this.date});

  /// Create a copy of this filter with updated values
  RequestFilter copyWith({
    RequestType? serviceType,
    RequestStatus? status,
    DateTime? date,
    bool clearService = false,
    bool clearStatus = false,
    bool clearDate = false,
  }) {
    return RequestFilter(
      serviceType: clearService ? null : (serviceType ?? this.serviceType),
      status: clearStatus ? null : (status ?? this.status),
      date: clearDate ? null : (date ?? this.date),
    );
  }

  /// Check if any filters are currently applied
  bool get hasFilters => serviceType != null || status != null || date != null;
}
