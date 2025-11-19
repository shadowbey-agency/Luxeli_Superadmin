import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/features/bookings/widgets/circular_progress_indicator_with_text.dart';
import 'package:uuid/uuid.dart'; // For generating unique IDs
import 'package:provider/provider.dart'; // Add this import

import '../models/food_item.dart';
import '../models/delivery_request.dart';
import '../widgets/food_item_card.dart';
import '../widgets/food_item_details_modal.dart';
import '../providers/delivery_provider.dart'; // Add this import
import '../models/restaurant.dart'; // Add this import

class RequestFoodScreen extends StatefulWidget {
  final Function(DeliveryRequest)? onDeliveryRequestAdded; // Make it optional

  const RequestFoodScreen({super.key, this.onDeliveryRequestAdded});

  @override
  State<RequestFoodScreen> createState() => _RequestFoodScreenState();
}

class _RequestFoodScreenState extends State<RequestFoodScreen> {
  int _currentStep = 1;
  final List<CartItem> _selectedItems = [];
  String _selectedPickupOption = 'Lunch';
  final TextEditingController _notesController = TextEditingController();
  final List<String> _pickupOptions = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Anytime',
  ];
  String? _selectedRestaurant;

  @override
  void initState() {
    super.initState();
    // Load restaurants when the screen initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadRestaurants();
    });
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _loadRestaurants() {
    final deliveryProvider = Provider.of<DeliveryProvider>(
      context,
      listen: false,
    );
    deliveryProvider.loadRestaurants();
  }

  void _showFoodItemDetails(FoodItem foodItem) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (context) {
        return FoodItemDetailsModal(
          foodItem: foodItem,
          onAddToCart: (item, quantity) {
            setState(() {
              final existingItemIndex = _selectedItems.indexWhere(
                (cartItem) => cartItem.foodItem.id == item.id,
              );
              if (existingItemIndex != -1) {
                _selectedItems[existingItemIndex].quantity += quantity;
              } else {
                _selectedItems.add(
                  CartItem(foodItem: item, quantity: quantity),
                );
              }
            });
          },
        );
      },
    );
  }

  Widget _buildCategoryChip(String label, {bool isSelected = false}) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: Chip(
        label: Text(label),
        backgroundColor: isSelected
            ? const Color(0xFF0D47A1)
            : Colors.grey[200],
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.grey[800],
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? const Color(0xFF0D47A1) : Colors.transparent,
          ),
        ),
      ),
    );
  }

  Widget _buildStep1() {
    return Consumer<DeliveryProvider>(
      builder: (context, deliveryProvider, child) {
        if (deliveryProvider.isLoading &&
            deliveryProvider.restaurants.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        // Get restaurant names for the dropdown
        final restaurantNames = deliveryProvider.restaurants
            .map((restaurant) => restaurant.restaurantName)
            .toList();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Order your meal',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Browse restaurant menus and add your favorite dishes.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  const CircularProgressIndicatorWithText(
                    currentStep: 1,
                    totalSteps: 2,
                    radius: 20,
                    strokeWidth: 2,
                    progressColor: Color(0xFF0D47A1),
                    backgroundColor: Colors.grey,
                    textStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0D47A1),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Food',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedRestaurant,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            labelText: 'Select Restaurant',
                          ),
                          items: [
                            if (restaurantNames.isEmpty)
                              const DropdownMenuItem<String>(
                                value: null,
                                child: Text('No restaurants available'),
                              )
                            else
                              ...restaurantNames.map<DropdownMenuItem<String>>((
                                String name,
                              ) {
                                return DropdownMenuItem<String>(
                                  value: name,
                                  child: Text(name),
                                );
                              }),
                          ],
                          onChanged: restaurantNames.isEmpty
                              ? null
                              : (String? newValue) {
                                  setState(() {
                                    _selectedRestaurant = newValue;
                                  });
                                  // Filter food items based on selected restaurant
                                },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.search, color: Colors.black),
                          onPressed: () {
                            // Handle search
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                children: [
                  _buildCategoryChip('All', isSelected: true),
                  _buildCategoryChip('Main Course'),
                  _buildCategoryChip('Snacks'),
                  _buildCategoryChip('Fast Food'),
                  _buildCategoryChip('Japanese'),
                ],
              ),
            ),
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(12.0),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 8.0,
                  mainAxisSpacing: 8.0,
                  childAspectRatio: 0.7, // Adjust as needed for card height
                ),
                itemCount: _getFilteredFoodItems(deliveryProvider).length,
                itemBuilder: (context, index) {
                  final foodItem = _getFilteredFoodItems(
                    deliveryProvider,
                  )[index];
                  return FoodItemCard(
                    foodItem: foodItem,
                    onAddPressed: () => _showFoodItemDetails(foodItem),
                  );
                },
              ),
            ),
            _buildBottomBarStep1(),
          ],
        );
      },
    );
  }

  List<FoodItem> _getFilteredFoodItems(DeliveryProvider deliveryProvider) {
    if (_selectedRestaurant == null) {
      // If no restaurant is selected, show items from all restaurants
      final allItems = <FoodItem>[];
      for (var restaurant in deliveryProvider.restaurants) {
        for (var menuItem in restaurant.items) {
          if (menuItem.status == 'published') {
            allItems.add(
              FoodItem(
                id: menuItem.itemName.hashCode.toString(),
                name: menuItem.itemName,
                description: menuItem.itemDescription,
                price: menuItem.itemPrice,
                imageUrl: menuItem.itemImage ?? '',
                category: menuItem.category,
                restaurantName: restaurant.restaurantName,
              ),
            );
          }
        }
      }
      return allItems;
    } else {
      // Show items only from the selected restaurant
      final selectedRestaurant = deliveryProvider.restaurants.firstWhere(
        (r) => r.restaurantName == _selectedRestaurant,
        orElse: () => Restaurant(
          id: '',
          restaurantName: '',
          status: 'closed',
          startWork: '',
          endWork: '',
          items: [],
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      );

      if (selectedRestaurant.id.isNotEmpty) {
        return selectedRestaurant.items
            .where((item) => item.status == 'published')
            .map(
              (menuItem) => FoodItem(
                id: menuItem.itemName.hashCode.toString(),
                name: menuItem.itemName,
                description: menuItem.itemDescription,
                price: menuItem.itemPrice,
                imageUrl: menuItem.itemImage ?? '',
                category: menuItem.category,
                restaurantName: selectedRestaurant.restaurantName,
              ),
            )
            .toList();
      }
    }
    return [];
  }

  Widget _buildBottomBarStep1() {
    final totalItems = _selectedItems.fold(
      0,
      (sum, item) => sum + item.quantity,
    );
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          Text(
            '$totalItems Items',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const Spacer(),
          SizedBox(
            width: 150,
            child: ElevatedButton(
              onPressed: totalItems > 0
                  ? () {
                      setState(() {
                        _currentStep = 2;
                      });
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D47A1), // Dark blue
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text(
                'Request items',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Confirm your request details',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Review the activity details and add any special notes before sending your request.',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              const CircularProgressIndicatorWithText(
                currentStep: 2,
                totalSteps: 2,
                radius: 20,
                strokeWidth: 2,
                progressColor: Color(0xFF0D47A1),
                backgroundColor: Colors.grey,
                textStyle: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0D47A1),
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Items',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _selectedItems.length,
                itemBuilder: (context, index) {
                  final cartItem = _selectedItems[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              cartItem.foodItem.imageUrl,
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  width: 60,
                                  height: 60,
                                  color: Colors.grey[300],
                                  child: const Icon(
                                    Icons.fastfood,
                                    color: Colors.grey,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cartItem.foodItem.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  NumberFormat.currency(
                                    locale: 'en_US',
                                    symbol: '\$',
                                  ).format(cartItem.foodItem.price),
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove, size: 20),
                                  onPressed: () {
                                    setState(() {
                                      if (cartItem.quantity > 1) {
                                        cartItem.quantity--;
                                      } else {
                                        _selectedItems.removeAt(index);
                                      }
                                    });
                                  },
                                ),
                                Text(
                                  '${cartItem.quantity}',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add, size: 20),
                                  onPressed: () {
                                    setState(() {
                                      cartItem.quantity++;
                                    });
                                  },
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.delete_outline,
                              color: Colors.red,
                            ),
                            onPressed: () {
                              setState(() {
                                _selectedItems.removeAt(index);
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Pick up',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedPickupOption,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
                items: _pickupOptions.map<DropdownMenuItem<String>>((
                  String value,
                ) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedPickupOption = newValue!;
                  });
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Additional notes',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: 'Note',
                  hintText:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit int',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        ),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _selectedItems.isNotEmpty
                  ? () async {
                      // Use the provider to add the request
                      final deliveryProvider = Provider.of<DeliveryProvider>(
                        context,
                        listen: false,
                      );

                      // Extract item names for the API call
                      final List<String> itemNames = _selectedItems
                          .map((item) => item.foodItem.name)
                          .toList();

                      // For now, we'll use placeholder values for room and restaurant
                      // In a real app, these would come from the context or user selection
                      final success = await deliveryProvider.addRequest(
                        roomName: 'Room 101', // Placeholder
                        residentialName: 'Main Building', // Placeholder
                        items: itemNames,
                        restaurant:
                            _selectedRestaurant ??
                            'Hotel Restaurant', // Use selected restaurant
                        pickup: _selectedPickupOption,
                        notes: _notesController.text,
                      );

                      if (success) {
                        // If the callback exists, call it for backward compatibility
                        if (widget.onDeliveryRequestAdded != null) {
                          final newRequest = DeliveryRequest(
                            id: const Uuid().v4().substring(
                              0,
                              5,
                            ), // Generate a short ID
                            requestTime: DateTime.now(),
                            pickupOption: _selectedPickupOption,
                            notes: _notesController.text,
                            items: List.from(_selectedItems), // Create a copy
                          );
                          widget.onDeliveryRequestAdded!(newRequest);
                        }
                        Navigator.of(
                          context,
                        ).pop(); // Go back to delivery screen
                      } else {
                        // Show error message
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Failed to create delivery request'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D47A1), // Dark blue
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Send request', style: TextStyle(fontSize: 16)),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            if (_currentStep == 2) {
              setState(() {
                _currentStep = 1;
              });
            } else {
              Navigator.of(context).pop();
            }
          },
        ),
        title: Text(
          'Request food',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.black),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
      body: _currentStep == 1 ? _buildStep1() : _buildStep2(),
    );
  }
}
