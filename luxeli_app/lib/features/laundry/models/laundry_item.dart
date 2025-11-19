import 'package:flutter/material.dart';

class LaundryItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final String category;
  final String imageUrl;
  final IconData icon;

  LaundryItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    required this.imageUrl,
    required this.icon,
  });

  factory LaundryItem.fromJson(Map<String, dynamic> json) {
    return LaundryItem(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String,
      icon: json['icon'] as IconData,
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
      'icon': icon,
    };
  }
}

final List<LaundryItem> dummyLaundryItems = [
  LaundryItem(
    id: '1',
    name: 'Wash',
    description: 'Regular washing service',
    price: 10.0,
    category: 'Basic',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    icon: Icons.local_laundry_service,
  ),
  LaundryItem(
    id: '2',
    name: 'Iron',
    description: 'Ironing service',
    price: 5.0,
    category: 'Basic',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    icon: Icons.iron,
  ),
  LaundryItem(
    id: '3',
    name: 'Dry Clean',
    description: 'Professional dry cleaning',
    price: 15.0,
    category: 'Premium',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    icon: Icons.cleaning_services,
  ),
  LaundryItem(
    id: '4',
    name: 'Fold',
    description: 'Folding service',
    price: 3.0,
    category: 'Basic',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    icon: Icons.check_box,
  ),
  LaundryItem(
    id: '5',
    name: 'Bleach',
    description: 'Bleaching service',
    price: 7.0,
    category: 'Special',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    icon: Icons.brightness_6,
  ),
  LaundryItem(
    id: '6',
    name: 'Starch',
    description: 'Starching service',
    price: 6.0,
    category: 'Special',
    imageUrl: 'https://picsum.photos/200/200?random=6',
    icon: Icons.opacity,
  ),
];
