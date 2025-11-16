class ActivityModel {
  final String? title;
  final String? subtitle;
  final bool isEmpty;

  ActivityModel({this.title, this.subtitle, this.isEmpty = false});
}

class CleaningModel {
  final String? time;
  final bool isEmpty;

  CleaningModel({this.time, this.isEmpty = false});
}

class FoodOrderModel {
  final String? status;
  final int? itemCount;
  final bool isEmpty;

  FoodOrderModel({this.status, this.itemCount, this.isEmpty = false});
}

class ServiceItemModel {
  final String id;
  final String title;
  final String description;
  final String imagePath;
  final String price;
  final bool isFree;

  ServiceItemModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imagePath,
    required this.price,
    this.isFree = false,
  });
}

enum ServiceCategory { bookings, housekeeping, activities }
