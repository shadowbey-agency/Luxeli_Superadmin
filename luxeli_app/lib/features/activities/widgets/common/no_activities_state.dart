import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';

class NoActivitiesState extends StatelessWidget {
  const NoActivitiesState({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFE3F2FD),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFBBDEFB), width: 2),
            ),
            child: SvgIcon(assetName: AppIcons.housekeeping, size: 40),
          ),
          const SizedBox(height: 16),
          const Text(
            'No activity requests available',
            style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
          ),
          const SizedBox(height: 8),
          const Text(
            'Join activities to see your requests here',
            style: TextStyle(fontSize: 14, color: Color(0xFFBDBDBD)),
          ),
        ],
      ),
    );
  }
}
