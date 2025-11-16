class SpecialItem {
  final String id;
  final String title;
  final String description;
  final String type;
  final double discount;
  final DateTime startDate;
  final DateTime endDate;
  final String status;
  final String imageUrl;

  SpecialItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.discount,
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.imageUrl,
  });

  factory SpecialItem.fromJson(Map<String, dynamic> json) {
    return SpecialItem(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: json['type'] as String,
      discount: (json['discount'] as num).toDouble(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      status: json['status'] as String,
      imageUrl: json['imageUrl'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'discount': discount,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'status': status,
      'imageUrl': imageUrl,
    };
  }
}
