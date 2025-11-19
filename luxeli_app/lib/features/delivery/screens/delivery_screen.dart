import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/delivery_provider.dart';
import '../widgets/list/delivery_list.dart';
import 'restaurants_screen.dart';
import 'request_food_screen.dart'; // Correct import
import '../models/delivery_request.dart'; // Import DeliveryRequest

class DeliveryScreen extends StatefulWidget {
  const DeliveryScreen({super.key});

  @override
  State<DeliveryScreen> createState() => _DeliveryScreenState();
}

class _DeliveryScreenState extends State<DeliveryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Load data when the screen initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  void _loadData() {
    final deliveryProvider = Provider.of<DeliveryProvider>(
      context,
      listen: false,
    );
    // Set token if available (this should be set elsewhere in the app)
    // deliveryProvider.setToken('YOUR_TOKEN_HERE');
    deliveryProvider.loadRestaurants();
    deliveryProvider.loadRequests();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showAddRequestScreen() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => RequestFoodScreen(
          onDeliveryRequestAdded: _handleDeliveryRequestAdded,
        ),
      ),
    );
  }

  void _handleDeliveryRequestAdded(DeliveryRequest request) {
    // This will be called when a new request is added
    // We don't need to do anything here as the Provider will handle the state
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.grey[50],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          'Room Delivery',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF0D47A1),
          indicatorWeight: 3,
          labelColor: const Color(0xFF0D47A1),
          unselectedLabelColor: Colors.grey,
          tabs: const [
            Tab(text: 'Restaurants'),
            Tab(text: 'Special'),
            Tab(text: 'My Requests'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddRequestScreen,
            tooltip: 'Add New Request',
          ),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          const RestaurantsScreen(),
          const SizedBox(), // Placeholder for Special tab
          const DeliveryList(), // Use DeliveryList widget
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddRequestScreen,
        backgroundColor: const Color(0xFF0D47A1),
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }
}
