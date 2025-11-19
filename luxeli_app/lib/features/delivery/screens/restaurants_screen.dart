import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/delivery/providers/delivery_provider.dart';
import 'package:luxeli_app/features/delivery/screens/restaurant_detail_screen.dart';
import 'package:luxeli_app/features/delivery/models/restaurant.dart';
import 'package:luxeli_app/features/delivery/widgets/add_restaurant_modal.dart';

class RestaurantsScreen extends StatelessWidget {
  const RestaurantsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<DeliveryProvider>(
      builder: (context, deliveryProvider, child) {
        if (deliveryProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (deliveryProvider.errorMessage != null &&
            deliveryProvider.errorMessage!.isNotEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Error: ${deliveryProvider.errorMessage}',
                  style: const TextStyle(color: Colors.red),
                ),
                ElevatedButton(
                  onPressed: () {
                    deliveryProvider.loadRestaurants();
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        final restaurants = deliveryProvider.restaurants;

        return Column(
          children: [
            // Add the "Add New Request" button at the top
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton.icon(
                onPressed: () {
                  // Show the add restaurant modal
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    builder: (BuildContext context) {
                      return AddRestaurantModal(
                        onRestaurantAdded: () {
                          // Reload restaurants when a new one is added
                          deliveryProvider.loadRestaurants();
                        },
                      );
                    },
                  );
                },
                icon: const Icon(Icons.add),
                label: const Text('Add New Request'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            // Restaurant list
            Expanded(
              child: restaurants.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.restaurant_menu,
                            size: 60,
                            color: Colors.grey,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No restaurants available',
                            style: TextStyle(fontSize: 18, color: Colors.grey),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Check back later for new restaurants',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      itemCount: restaurants.length,
                      itemBuilder: (context, index) {
                        final restaurant = restaurants[index];
                        return _buildRestaurantCard(context, restaurant);
                      },
                    ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildRestaurantCard(BuildContext context, Restaurant restaurant) {
    final openItems = restaurant.items
        .where((item) => item.status == 'published')
        .toList();
    final itemCount = openItems.length;

    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      elevation: 2,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) =>
                  RestaurantDetailScreen(restaurant: restaurant),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (restaurant.restaurantImage != null &&
                restaurant.restaurantImage!.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12.0),
                ),
                child: Image.network(
                  restaurant.restaurantImage!,
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 150,
                      width: double.infinity,
                      color: Colors.grey[300],
                      child: const Icon(
                        Icons.restaurant,
                        size: 50,
                        color: Colors.grey,
                      ),
                    );
                  },
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Container(
                      height: 150,
                      width: double.infinity,
                      color: Colors.grey[300],
                      child: Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                              : null,
                        ),
                      ),
                    );
                  },
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          restaurant.restaurantName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Open',
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(
                        Icons.restaurant_menu,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$itemCount items available',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
