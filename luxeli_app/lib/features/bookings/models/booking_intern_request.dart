class BookingInternRequest {
  final String id;
  final String roomName;
  final String residentEmail;
  final String category;
  final String status;
  final Assignee? assignee;
  final Reservation reservation;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  BookingInternRequest({
    required this.id,
    required this.roomName,
    required this.residentEmail,
    required this.category,
    required this.status,
    this.assignee,
    required this.reservation,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BookingInternRequest.fromJson(Map<String, dynamic> json) {
    return BookingInternRequest(
      id: json['_id'] as String? ?? json['id'] as String,
      roomName: json['roomName'] as String? ?? '',
      residentEmail: json['residentEmail'] as String? ?? '',
      category: json['category'] as String? ?? '',
      status: json['status'] as String? ?? 'new',
      assignee: json['assignee'] != null
          ? Assignee.fromJson(json['assignee'] as Map<String, dynamic>)
          : null,
      reservation: Reservation.fromJson(
        json['reservation'] as Map<String, dynamic>,
      ),
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'roomName': roomName,
      'residentEmail': residentEmail,
      'category': category,
      'status': status,
      'assignee': assignee?.toJson(),
      'reservation': reservation.toJson(),
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
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

class Reservation {
  final String date;
  final String time;

  Reservation({required this.date, required this.time});

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      date: json['date'] as String? ?? '',
      time: json['time'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'date': date, 'time': time};
  }
}
