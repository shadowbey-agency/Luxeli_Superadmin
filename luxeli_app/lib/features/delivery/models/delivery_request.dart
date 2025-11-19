import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'food_item.dart';

enum DeliveryStatus { pending, completed, cancelled }

class DeliveryRequest {
  final String id;
  final DateTime requestTime;
  final String pickupOption;
  final String notes;
  final List<CartItem> items;
  DeliveryStatus status;

  DeliveryRequest({
    required this.id,
    required this.requestTime,
    required this.pickupOption,
    this.notes = '',
    required this.items,
    this.status = DeliveryStatus.pending,
  });

  String get formattedDate => DateFormat('dd/MM/yyyy').format(requestTime);
  String get formattedTime => DateFormat('HH:mm a').format(requestTime);
  int get totalItemsCount => items.fold(0, (sum, item) => sum + item.quantity);

  String get statusText {
    switch (status) {
      case DeliveryStatus.pending:
        return 'Pending';
      case DeliveryStatus.completed:
        return 'Completed';
      case DeliveryStatus.cancelled:
        return 'Cancelled';
    }
  }

  Color get statusColor {
    switch (status) {
      case DeliveryStatus.pending:
        return Colors.orange;
      case DeliveryStatus.completed:
        return Colors.green;
      case DeliveryStatus.cancelled:
        return Colors.red;
    }
  }
}

// Dummy data for demonstration
final List<DeliveryRequest> dummyDeliveryRequests = [
  DeliveryRequest(
    id: 'DEL15654',
    requestTime: DateTime.now().subtract(const Duration(hours: 1)),
    pickupOption: 'Lunch',
    items: [
      CartItem(foodItem: dummyFoodItems[0], quantity: 1),
      CartItem(foodItem: dummyFoodItems[1], quantity: 2),
    ],
    status: DeliveryStatus.pending,
  ),
  DeliveryRequest(
    id: 'DEL15653',
    requestTime: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
    pickupOption: 'Dinner',
    items: [CartItem(foodItem: dummyFoodItems[2], quantity: 3)],
    status: DeliveryStatus.completed,
  ),
  DeliveryRequest(
    id: 'DEL15652',
    requestTime: DateTime.now().subtract(const Duration(days: 1, hours: 10)),
    pickupOption: 'Breakfast',
    items: [
      CartItem(foodItem: dummyFoodItems[3], quantity: 1),
      CartItem(foodItem: dummyFoodItems[4], quantity: 1),
    ],
    status: DeliveryStatus.completed,
  ),
];
