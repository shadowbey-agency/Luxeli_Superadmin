class DeliveryItem {
  final String title;
  final String description;

  DeliveryItem({required this.title, required this.description});

  // Factory constructor to create an Item from JSON
  factory DeliveryItem.fromJson(Map<String, dynamic> json) {
    return DeliveryItem(
      title: json['title'] as String,
      description: json['description'] as String,
    );
  }

  // Method to convert an Item to JSON
  Map<String, dynamic> toJson() {
    return {'title': title, 'description': description};
  }
}
