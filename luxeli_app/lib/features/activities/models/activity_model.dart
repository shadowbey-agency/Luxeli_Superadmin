class Activity {
  final String id;
  final String activityTitle;
  final String status; // 'published' or 'unpublished'
  final String activityDescription;
  final String? activityImage;
  final String createdBy;
  final DateTime createdAt;
  final DateTime updatedAt;

  Activity({
    required this.id,
    required this.activityTitle,
    required this.status,
    required this.activityDescription,
    this.activityImage,
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
  });

  Activity copyWith({
    String? id,
    String? activityTitle,
    String? status,
    String? activityDescription,
    String? activityImage,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Activity(
      id: id ?? this.id,
      activityTitle: activityTitle ?? this.activityTitle,
      status: status ?? this.status,
      activityDescription: activityDescription ?? this.activityDescription,
      activityImage: activityImage ?? this.activityImage,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id: json['_id'] as String,
      activityTitle: json['activityTitle'] as String,
      status: json['status'] as String,
      activityDescription: json['activityDescription'] as String,
      activityImage: json['activityImage'] as String?,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}
