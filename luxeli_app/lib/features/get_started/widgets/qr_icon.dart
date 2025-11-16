import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';

class QrIcon extends StatelessWidget {
  const QrIcon({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Image.asset(AppImages.qrCode));
  }
}
