import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/core/utils/app_logger.dart';
import '../models/activity_model.dart';

class HomeProvider extends ChangeNotifier {
  int _selectedBottomNavIndex = 0;
  ServiceCategory _selectedCategory = ServiceCategory.bookings;
  bool _showOnboarding = true;

  ActivityModel? _todayActivity;
  CleaningModel? _nextCleaning;
  FoodOrderModel? _foodOrder;

  List<ServiceItemModel> _serviceItems = [];

  int get selectedBottomNavIndex => _selectedBottomNavIndex;
  ServiceCategory get selectedCategory => _selectedCategory;
  bool get showOnboarding => _showOnboarding;

  ActivityModel get todayActivity =>
      _todayActivity ?? ActivityModel(isEmpty: true);
  CleaningModel get nextCleaning =>
      _nextCleaning ?? CleaningModel(isEmpty: true);
  FoodOrderModel get foodOrder => _foodOrder ?? FoodOrderModel(isEmpty: true);

  List<ServiceItemModel> get serviceItems => _serviceItems;

  HomeProvider() {
    _initializeData();
  }

  void _initializeData() {
    // Initialize with sample data (can be empty state)
    _todayActivity = ActivityModel(
      title: 'Morning',
      subtitle: 'Beach Yoga',
      isEmpty: false,
    );

    _nextCleaning = CleaningModel(time: '09:19:00', isEmpty: false);

    _foodOrder = FoodOrderModel(
      status: 'Ongoing',
      itemCount: 5,
      isEmpty: false,
    );

    _loadServiceItems();
  }

  void _loadServiceItems() {
    _serviceItems = [
      ServiceItemModel(
        id: '1',
        title: 'Morning Yoga Class',
        description: 'Rorem ipsum dolor sit amet...',
        imagePath: AppImages.onboarding1,
        price: '20',
        isFree: false,
      ),
      ServiceItemModel(
        id: '2',
        title: 'Pool Access',
        description: 'Rorem ipsum dolor sit amet...',
        imagePath: AppImages.onboarding2,
        price: '0',
        isFree: true,
      ),
    ];
  }

  void setEmptyStates() {
    _todayActivity = ActivityModel(isEmpty: true);
    _nextCleaning = CleaningModel(isEmpty: true);
    _foodOrder = FoodOrderModel(isEmpty: true);
    notifyListeners();
  }

  void setBottomNavIndex(int index) {
    _selectedBottomNavIndex = index;
    notifyListeners();
  }

  void setSelectedCategory(ServiceCategory category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void dismissOnboarding() {
    _showOnboarding = false;
    notifyListeners();
  }

  void requestService(String serviceId) {
    // Handle service request
    AppLogger.log('Service requested: $serviceId');
  }
}