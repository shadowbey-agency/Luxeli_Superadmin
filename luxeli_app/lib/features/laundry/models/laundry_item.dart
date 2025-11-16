class LaundryItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final String category;
  final String imageUrl;

  LaundryItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    required this.imageUrl,
  });

  factory LaundryItem.fromJson(Map<String, dynamic> json) {
    return LaundryItem(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'category': category,
      'imageUrl': imageUrl,
    };
  }
}
