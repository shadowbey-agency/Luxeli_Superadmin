import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/core/utils/app_logger.dart';
import '../models/cleaning_service_model.dart';

class CleaningServiceProvider extends ChangeNotifier {
  List<CleaningServiceModel> _services = [];
  CleaningServiceModel? _selectedService;
  bool _isLoading = false;

  List<CleaningServiceModel> get services => _services;
  CleaningServiceModel? get selectedService => _selectedService;
  bool get isLoading => _isLoading;

  CleaningServiceProvider() {
    _loadServices();
  }

  Future<void> _loadServices() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Simulate API call delay
      await Future.delayed(Duration(seconds: 1));

      // Mock data for cleaning services
      _services = [
        CleaningServiceModel(
          id: '1',
          title: 'Standard Room Cleaning',
          description: 'Regular cleaning of your room including dusting, vacuuming, and bathroom sanitization.',
          imagePath: AppImages.onboarding1,
          price: 25.0,
          isFree: false,
          duration: 45,
          isAvailable: true,
        ),
        CleaningServiceModel(
          id: '2',
          title: 'Deep Cleaning',
          description: 'Thorough cleaning including all surfaces, appliances, and hard-to-reach areas.',
          imagePath: AppImages.onboarding2,
          price: 45.0,
          isFree: false,
          duration: 90,
          isAvailable: true,
        ),
        CleaningServiceModel(
          id: '3',
          title: 'Premium Cleaning',
          description: 'Complete room refresh with premium amenities and extra attention to detail.',
          imagePath: AppImages.onboarding3,
          price: 65.0,
          isFree: false,
          duration: 120,
          isAvailable: true,
        ),
        CleaningServiceModel(
          id: '4',
          title: 'Eco-Friendly Cleaning',
          description: 'Environmentally conscious cleaning using organic and biodegradable products.',
          imagePath: AppImages.onboarding4,
          price: 35.0,
          isFree: false,
          duration: 60,
          isAvailable: true,
        ),
      ];
    } catch (e) {
      AppLogger.logError('Error loading cleaning services: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectService(CleaningServiceModel service) {
    _selectedService = service;
    notifyListeners();
  }

  void clearSelection() {
    _selectedService = null;
    notifyListeners();
  }

  Future<void> requestService(CleaningServiceModel service) async {
    AppLogger.log('Requesting cleaning service: ${service.title}');
    // In a real app, this would make an API call to request the service
    selectService(service);
    
    // Simulate API call
    await Future.delayed(Duration(seconds: 1));
    
    // Show success message or navigate to confirmation screen
  }
}