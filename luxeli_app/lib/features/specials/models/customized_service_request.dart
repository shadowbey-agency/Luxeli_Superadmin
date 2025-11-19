class CustomizedServiceRequest {
  final String id;
  final String customId;
  final String roomName;
  final String residentEmail;
  final String title;
  final String? description;
  final String status;
  final Assignee? assignee;
  final DateTime createdAt;
  final DateTime updatedAt;

  CustomizedServiceRequest({
    required this.id,
    required this.customId,
    required this.roomName,
    required this.residentEmail,
    required this.title,
    this.description,
    required this.status,
    this.assignee,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CustomizedServiceRequest.fromJson(Map<String, dynamic> json) {
    return CustomizedServiceRequest(
      id: json['_id'] as String? ?? json['id'] as String,
      customId: json['customId'] as String? ?? '',
      roomName: json['roomName'] as String? ?? '',
      residentEmail: json['residentEmail'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String?,
      status: json['status'] as String? ?? 'new',
      assignee: json['assignee'] != null
          ? Assignee.fromJson(json['assignee'] as Map<String, dynamic>)
          : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'customId': customId,
      'roomName': roomName,
      'residentEmail': residentEmail,
      'title': title,
      'description': description,
      'status': status,
      'assignee': assignee?.toJson(),
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
