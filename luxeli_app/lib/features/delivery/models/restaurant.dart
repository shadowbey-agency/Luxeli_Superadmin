class Restaurant {
  final String id;
  final String restaurantName;
  final String status;
  final String startWork;
  final String endWork;
  final String? restaurantImage;
  final List<MenuItem> items;
  final DateTime createdAt;
  final DateTime updatedAt;

  Restaurant({
    required this.id,
    required this.restaurantName,
    required this.status,
    required this.startWork,
    required this.endWork,
    this.restaurantImage,
    required this.items,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    // Helper functions for safe parsing
    String getString(dynamic value, [String fallback = '']) {
      if (value == null) return fallback;
      if (value is String) return value;
      return fallback;
    }

    DateTime parseDate(dynamic dateValue) {
      if (dateValue == null) {
        return DateTime.now();
      }
      if (dateValue is String) {
        try {
          return DateTime.parse(dateValue);
        } catch (e) {
          return DateTime.now();
        }
      }
      if (dateValue is Map<String, dynamic> &&
          dateValue.containsKey('\$date')) {
        try {
          return DateTime.parse(dateValue['\$date']);
        } catch (e) {
          return DateTime.now();
        }
      }
      return DateTime.now();
    }

    return Restaurant(
      id: getString(json['_id'] ?? json['id'] ?? ''),
      restaurantName: getString(json['restaurantName'] ?? ''),
      status: getString(json['status'] ?? 'open'),
      startWork: getString(json['startWork'] ?? '09:00'),
      endWork: getString(json['endWork'] ?? '21:00'),
      restaurantImage: getString(json['restaurantImage']),
      items:
          (json['items'] as List?)
              ?.map((item) => MenuItem.fromJson(item))
              .toList() ??
          [],
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseDate(json['updatedAt']),
    );
  }
}

class MenuItem {
  final String itemName;
  final String status;
  final String category;
  final double itemPrice;
  final String itemDescription;
  final String? itemImage;

  MenuItem({
    required this.itemName,
    required this.status,
    required this.category,
    required this.itemPrice,
    required this.itemDescription,
    this.itemImage,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    // Helper functions for safe parsing
    String getString(dynamic value, [String fallback = '']) {
      if (value == null) return fallback;
      if (value is String) return value;
      return fallback;
    }

    double getDouble(dynamic value, [double fallback = 0.0]) {
      if (value == null) return fallback;
      if (value is num) return value.toDouble();
      return fallback;
    }

    return MenuItem(
      itemName: getString(json['itemName'] ?? ''),
      status: getString(json['status'] ?? 'unpublished'),
      category: getString(json['category'] ?? 'General'),
      itemPrice: getDouble(json['itemPrice']),
      itemDescription: getString(json['itemDescription'] ?? ''),
      itemImage: getString(json['itemImage']),
    );
  }
}
