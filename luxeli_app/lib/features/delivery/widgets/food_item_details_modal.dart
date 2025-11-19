import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/food_item.dart';

class FoodItemDetailsModal extends StatefulWidget {
  final FoodItem foodItem;
  final Function(FoodItem, int) onAddToCart;

  const FoodItemDetailsModal({
    super.key,
    required this.foodItem,
    required this.onAddToCart,
  });

  @override
  State<FoodItemDetailsModal> createState() => _FoodItemDetailsModalState();
}

class _FoodItemDetailsModalState extends State<FoodItemDetailsModal> {
  int _quantity = 1;

  void _incrementQuantity() {
    setState(() {
      _quantity++;
    });
  }

  void _decrementQuantity() {
    setState(() {
      if (_quantity > 1) {
        _quantity--;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'en_US',
      symbol: '\$',
    );

    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Item details',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              widget.foodItem.imageUrl,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                // Fallback container with icon if image fails to load
                return Container(
                  height: 200,
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
          const SizedBox(height: 16),
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for restaurant logo
                  width: 40,
                  height: 40,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    // Fallback container with icon if image fails to load
                    return Container(
                      width: 40,
                      height: 40,
                      color: const Color(0xFFE0E0E0),
                      child: const Icon(
                        Icons.restaurant,
                        color: Color(0xFF9E9E9E),
                        size: 20,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),
              Text(
                widget.foodItem.restaurantName,
                style: TextStyle(fontSize: 14, color: Colors.grey[700]),
              ),
              const Spacer(),
              OutlinedButton(
                onPressed: () {
                  // Handle open restaurant details
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF0D47A1),
                  side: const BorderSide(color: Color(0xFF0D47A1)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                ),
                child: const Text('Open'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            widget.foodItem.name,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            widget.foodItem.description,
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
          ),
          const SizedBox(height: 16),
          Text(
            currencyFormatter.format(widget.foodItem.price),
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0D47A1),
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    widget.onAddToCart(widget.foodItem, _quantity);
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D47A1), // Dark blue
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Add to request',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Container(
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove, color: Colors.black),
                      onPressed: _decrementQuantity,
                    ),
                    Text(
                      '$_quantity',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add, color: Colors.black),
                      onPressed: _incrementQuantity,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
