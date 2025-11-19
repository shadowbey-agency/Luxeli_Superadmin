class FoodItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final String restaurantName;

  FoodItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    this.category = 'General',
    this.restaurantName = 'Hotel Restaurant',
  });
}

final List<FoodItem> dummyFoodItems = [
  FoodItem(
    id: 'f1',
    name: 'Grilled Salmon',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 20.0,
    imageUrl:
        'https://images.unsplash.com/photo-1563612116625-3016379e07ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Main Course',
    restaurantName: 'Ocean Grill',
  ),
  FoodItem(
    id: 'f2',
    name: 'Spicy Chicken Curry',
    description:
        'Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    price: 15.0,
    imageUrl:
        'https://images.unsplash.com/photo-1588166524941-cfbf65117766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Main Course',
    restaurantName: 'Spice Route',
  ),
  FoodItem(
    id: 'f3',
    name: 'Vegetable Wrap',
    description: 'Consectetur adipiscing elit. Nunc vulputate libero et velit.',
    price: 12.0,
    imageUrl:
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Snacks',
    restaurantName: 'Garden Fresh',
  ),
  FoodItem(
    id: 'f4',
    name: 'Classic Burger',
    description:
        'Interdum, ac aliquet odio mattis. Lorem ipsum dolor sit amet.',
    price: 18.0,
    imageUrl:
        'https://images.unsplash.com/photo-1568901346379-8ce8c6c89597?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Fast Food',
    restaurantName: 'Diner Delights',
  ),
  FoodItem(
    id: 'f5',
    name: 'Sushi Platter',
    description:
        'Aliquam erat volutpat. Sed do eiusmod tempor incididunt ut labore.',
    price: 25.0,
    imageUrl:
        'https://images.unsplash.com/photo-1579871128791-8d6010d7128b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Japanese',
    restaurantName: 'Sushi Master',
  ),
];

class CartItem {
  final FoodItem foodItem;
  int quantity;

  CartItem({required this.foodItem, this.quantity = 1});

  double get totalPrice => foodItem.price * quantity;
}
