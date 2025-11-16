import 'package:flutter/material.dart';

class BookingProvider extends ChangeNotifier {
  String _selectedService = '';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _selectedTime = const TimeOfDay(hour: 9, minute: 0);
  String _notes = '';

  // Getters
  String get selectedService => _selectedService;
  DateTime get selectedDate => _selectedDate;
  TimeOfDay get selectedTime => _selectedTime;
  String get notes => _notes;

  // Setters
  void setSelectedService(String service) {
    _selectedService = service;
    notifyListeners();
  }

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  void setSelectedTime(TimeOfDay time) {
    _selectedTime = time;
    notifyListeners();
  }

  void setNotes(String notes) {
    _notes = notes;
    notifyListeners();
  }

  // Reset form
  void resetForm() {
    _selectedService = '';
    _selectedDate = DateTime.now().add(const Duration(days: 1));
    _selectedTime = const TimeOfDay(hour: 9, minute: 0);
    _notes = '';
    notifyListeners();
  }

  // Submit booking
  Future<bool> submitBooking() async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    // In a real app, you would make an API call here
    // For now, we'll just return true to indicate success
    return true;
  }
}