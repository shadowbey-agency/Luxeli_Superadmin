import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/core/routes/app_routes.dart';

class ContentHeader extends StatelessWidget {
  const ContentHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            width: 94.207,
            height: 39.634,
            child: Image.asset(AppImages.logoScreenshot, fit: BoxFit.contain),
          ),
          Row(
            children: [
              _buildGlassButton(
                child: Icon(Icons.search, size: 18, color: Colors.black),
                onTap: () {},
              ),
              SizedBox(width: 12),
              _buildGlassButton(
                child: Stack(
                  children: [
                    Icon(
                      Icons.notifications_outlined,
                      size: 18,
                      color: Colors.black,
                    ),
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        width: 6.483,
                        height: 6.483,
                        decoration: BoxDecoration(
                          color: Color(0xFFEC1C2C),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
                onTap: () {
                  Navigator.pushNamed(context, AppRoutes.notifications);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGlassButton({
    required Widget child,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: Color(0xFFFBFAFA),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.black, width: 0.818),
        ),
        child: Center(child: child),
      ),
    );
  }
}
