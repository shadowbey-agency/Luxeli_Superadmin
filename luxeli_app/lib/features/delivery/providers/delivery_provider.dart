import 'package:flutter/material.dart';

import '../models/delivery_request.dart' show DeliveryRequest, DeliveryStatus;
import '../models/food_item.dart';
import '../models/restaurant.dart';
import '../services/delivery_service.dart';
import '../services/restaurant_service.dart';

class DeliveryProvider with ChangeNotifier {
  final List<Restaurant> _restaurants = [];
  final List<FoodItem> _foodItems = [];
  final List<DeliveryRequest> _deliveryRequests = [];
  bool _isLoading = false;
  String? _token;
  String? _errorMessage;

  List<Restaurant> get restaurants => [..._restaurants];
  List<FoodItem> get foodItems => [..._foodItems];
  List<DeliveryRequest> get deliveryRequests => [..._deliveryRequests];
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Set the user token for API authentication and auto-load requests and restaurants
  void setToken(String token) {
    _token = token;
    loadRequests(); // Auto-load requests when token is set
    loadRestaurants(); // Auto-load restaurants when token is set
  }

  // Load restaurants from the API
  Future<void> loadRestaurants() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await RestaurantService.getRestaurants(token: _token);

      if (response != null && response['success'] == true) {
        final List restaurantsData = response['data']['restaurants'];
        _restaurants.clear();

        for (var restaurantJson in restaurantsData) {
          final List itemsData = restaurantJson['items'] as List;
          final List<MenuItem> menuItems = [];

          for (var itemJson in itemsData) {
            menuItems.add(
              MenuItem(
                itemName: itemJson['itemName'] ?? '',
                status: itemJson['status'] ?? 'unpublished',
                category: itemJson['category'] ?? '',
                itemPrice: (itemJson['itemPrice'] is num)
                    ? itemJson['itemPrice'].toDouble()
                    : 0.0,
                itemDescription: itemJson['itemDescription'] ?? '',
                itemImage: itemJson['itemImage'],
              ),
            );
          }

          _restaurants.add(
            Restaurant(
              id: restaurantJson['_id'] ?? restaurantJson['id'] ?? '',
              restaurantName: restaurantJson['restaurantName'] ?? '',
              status: restaurantJson['status'] ?? 'open',
              startWork: restaurantJson['startWork'] ?? '',
              endWork: restaurantJson['endWork'] ?? '',
              restaurantImage: restaurantJson['restaurantImage'],
              items: menuItems,
              createdAt: restaurantJson['createdAt'] != null
                  ? DateTime.parse(restaurantJson['createdAt'])
                  : DateTime.now(),
              updatedAt: restaurantJson['updatedAt'] != null
                  ? DateTime.parse(restaurantJson['updatedAt'])
                  : DateTime.now(),
            ),
          );
        }
      } else {
        _errorMessage = response?['message'] ?? 'Failed to load restaurants';
      }
    } catch (e) {
      _errorMessage = 'Error loading restaurants: $e';
      print('Error loading restaurants: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load delivery requests from the API (renamed to match Housekeeping pattern)
  Future<void> loadRequests() async {
    if (_token == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await DeliveryService.getMyRequests(
        token: _token!,
        page: 1,
        limit: 20,
      );

      if (response != null && response['success'] == true) {
        final List requestsData = response['data']['requests'];
        _deliveryRequests.clear();

        for (var requestJson in requestsData) {
          // Create dummy CartItems from the items list
          List<CartItem> cartItems = [];
          if (requestJson['items'] != null) {
            for (var item in List<String>.from(requestJson['items'])) {
              cartItems.add(
                CartItem(
                  foodItem: FoodItem(
                    id: '1',
                    name: item,
                    description: '',
                    price: 0.0,
                    imageUrl: '',
                    category: 'General',
                    restaurantName: requestJson['restaurant'] ?? 'Restaurant',
                  ),
                  quantity: 1,
                ),
              );
            }
          }

          _deliveryRequests.add(
            DeliveryRequest(
              id: requestJson['_id'] ?? requestJson['id'] ?? '',
              requestTime: DateTime.parse(
                requestJson['createdAt'] ?? DateTime.now().toIso8601String(),
              ),
              pickupOption: requestJson['pickup'] ?? '',
              notes: requestJson['notes'] ?? '',
              items: cartItems,
              status: _mapStatus(requestJson['status']),
            ),
          );
        }
      } else {
        _errorMessage =
            response?['message'] ?? 'Failed to load delivery requests';
      }
    } catch (e) {
      _errorMessage = 'Error loading delivery requests: $e';
      print('Error loading delivery requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new delivery request and sync with the API
  Future<bool> addRequest({
    required String roomName,
    required String residentialName,
    required List<String> items,
    required String restaurant,
    required String pickup,
    String? notes,
  }) async {
    if (_token == null) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await DeliveryService.createRequest(
        token: _token!,
        roomName: roomName,
        residentialName: residentialName,
        items: items,
        restaurant: restaurant,
        pickup: pickup,
        notes: notes,
      );

      if (response != null && response['success'] == true) {
        final requestJson = response['data']['request'];

        // Create dummy CartItems from the items list
        List<CartItem> cartItems = [];
        if (requestJson['items'] != null) {
          for (var item in List<String>.from(requestJson['items'])) {
            cartItems.add(
              CartItem(
                foodItem: FoodItem(
                  id: '1',
                  name: item,
                  description: '',
                  price: 0.0,
                  imageUrl: '',
                  category: 'General',
                  restaurantName: requestJson['restaurant'] ?? restaurant,
                ),
                quantity: 1,
              ),
            );
          }
        }

        final newRequest = DeliveryRequest(
          id: requestJson['_id'] ?? requestJson['id'] ?? '',
          requestTime: DateTime.parse(
            requestJson['createdAt'] ?? DateTime.now().toIso8601String(),
          ),
          pickupOption: requestJson['pickup'] ?? pickup,
          notes: requestJson['notes'] ?? notes ?? '',
          items: cartItems,
          status: _mapStatus(requestJson['status']),
        );

        _deliveryRequests.insert(
          0,
          newRequest,
        ); // Add to the beginning of the list
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage =
            response?['message'] ?? 'Failed to create delivery request';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error adding delivery request: $e';
      print('Error adding delivery request: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Map backend status to frontend status
  DeliveryStatus _mapStatus(String? backendStatus) {
    switch (backendStatus) {
      case 'new':
        return DeliveryStatus.pending;
      case 'accepted':
        return DeliveryStatus.pending; // Using pending for accepted as well
      case 'completed':
        return DeliveryStatus.completed;
      case 'canceled':
        return DeliveryStatus.cancelled;
      case 'no-show':
        return DeliveryStatus.cancelled; // Using cancelled for no-show
      default:
        return DeliveryStatus.pending;
    }
  }

  /// Create a new restaurant
  Future<bool> createRestaurant({
    required String restaurantName,
    required String status,
    required String startWork,
    required String endWork,
    String? restaurantImage,
    List<Map<String, dynamic>>? items,
  }) async {
    if (_token == null) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await RestaurantService.createRestaurant(
        token: _token!,
        restaurantName: restaurantName,
        status: status,
        startWork: startWork,
        endWork: endWork,
        restaurantImage: restaurantImage,
        items: items,
      );

      if (response != null && response['success'] == true) {
        // Reload restaurants to show the new one
        await loadRestaurants();
        return true;
      } else {
        _errorMessage = response?['message'] ?? 'Failed to create restaurant';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error creating restaurant: $e';
      print('Error creating restaurant: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
