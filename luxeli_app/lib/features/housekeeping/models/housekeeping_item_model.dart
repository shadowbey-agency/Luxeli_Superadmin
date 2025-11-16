class HousekeepingItem {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String category;
  final DateTime createdAt;

  HousekeepingItem({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.category,
    required this.createdAt,
  });

  factory HousekeepingItem.fromJson(Map<String, dynamic> json) {
    return HousekeepingItem(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
      category: json['category'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'category': category,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
