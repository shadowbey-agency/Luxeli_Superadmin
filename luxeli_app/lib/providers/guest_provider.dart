import 'package:flutter/material.dart';
import 'package:luxeli_app/core/models/guest_model.dart';

class GuestProvider with ChangeNotifier {
  GuestData? _guestData;

  GuestData? get guestData => _guestData;

  bool get isLoggedIn => _guestData != null;

  void setGuestData(GuestData guestData) {
    _guestData = guestData;
    notifyListeners();
  }

  void clearGuestData() {
    _guestData = null;
    notifyListeners();
  }
}
