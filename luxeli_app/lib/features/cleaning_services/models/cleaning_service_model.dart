class CleaningServiceModel {
  final String id;
  final String title;
  final String description;
  final String imagePath;
  final double price;
  final bool isFree;
  final int duration; // in minutes
  final bool isAvailable;

  CleaningServiceModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imagePath,
    required this.price,
    required this.isFree,
    required this.duration,
    required this.isAvailable,
  });

  // Factory constructor for creating a CleaningServiceModel from JSON
  factory CleaningServiceModel.fromJson(Map<String, dynamic> json) {
    return CleaningServiceModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      imagePath: json['imagePath'] as String,
      price: (json['price'] as num).toDouble(),
      isFree: json['isFree'] as bool,
      duration: json['duration'] as int,
      isAvailable: json['isAvailable'] as bool,
    );
  }

  // Method to convert a CleaningServiceModel to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imagePath': imagePath,
      'price': price,
      'isFree': isFree,
      'duration': duration,
      'isAvailable': isAvailable,
    };
  }
}