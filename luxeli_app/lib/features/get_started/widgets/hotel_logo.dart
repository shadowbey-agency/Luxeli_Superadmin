import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';

class HotelLogo extends StatelessWidget {
  const HotelLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: 55,
        height: 78,
        child: Image.asset(AppImages.iconLuxeli, fit: BoxFit.contain),
      ),
    );
  }
}
