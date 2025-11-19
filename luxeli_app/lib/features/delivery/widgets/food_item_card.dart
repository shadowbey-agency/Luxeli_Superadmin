import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/food_item.dart';

class FoodItemCard extends StatelessWidget {
  final FoodItem foodItem;
  final VoidCallback onAddPressed;

  const FoodItemCard({
    super.key,
    required this.foodItem,
    required this.onAddPressed,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'en_US',
      symbol: '\$',
    );

    return Card(
      margin: const EdgeInsets.all(4.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      elevation: 2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12.0),
                ),
                child: Image.network(
                  foodItem.imageUrl,
                  height: 120,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    // Fallback container with icon if image fails to load
                    return Container(
                      height: 120,
                      width: double.infinity,
                      color: const Color(0xFFE0E0E0),
                      child: const Icon(
                        Icons.fastfood,
                        color: Color(0xFF9E9E9E),
                        size: 50,
                      ),
                    );
                  },
                ),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    currencyFormatter.format(foodItem.price),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 8,
                right: 8,
                child: GestureDetector(
                  onTap: onAddPressed,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D47A1), // Dark blue
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 18),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  foodItem.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  foodItem.description,
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
