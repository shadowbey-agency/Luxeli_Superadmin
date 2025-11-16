import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/home/screens/home_screen.dart';
import 'package:luxeli_app/features/requests/screens/request_screen.dart';
import 'package:luxeli_app/features/support/support_screen.dart';
import 'package:luxeli_app/features/profile/views/profile_screen.dart';
import 'package:luxeli_app/features/home/providers/home_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/add_request_options_modal.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeProvider>(
      builder: (context, homeProvider, child) {
        final int selectedIndex = homeProvider.selectedBottomNavIndex;
        Widget screen;
        switch (selectedIndex) {
          case 0:
            screen = HomeScreen();
            break;
          case 1:
            screen = RequestScreen();
            break;
          case 2:
            screen = HomeScreen();
            break;
          case 3:
            screen = SupportScreen();
            break;
          case 4:
            screen = ProfileScreen();
            break;
          default:
            screen = HomeScreen();
        }

        return Scaffold(
          body: screen,
          bottomNavigationBar: Container(
            height: 60,
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey,
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(context, AppIcons.home, 'Home', 0, homeProvider),
                _buildNavItem(
                  context,
                  AppIcons.file,
                  'Requests',
                  1,
                  homeProvider,
                ),
                _buildCenterButton(context, homeProvider),
                _buildNavItem(
                  context,
                  AppIcons.statusError,
                  'Support',
                  3,
                  homeProvider,
                ),
                _buildNavItem(
                  context,
                  AppIcons.userCircle,
                  'Profile',
                  4,
                  homeProvider,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    String svgAsset,
    String label,
    int index,
    HomeProvider homeProvider,
  ) {
    final bool isSelected = homeProvider.selectedBottomNavIndex == index;

    return GestureDetector(
      onTap: () {
        homeProvider.setBottomNavIndex(index);
      },
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: SvgIcon(
                assetName: svgAsset,
                color: isSelected
                    ? Color(0xFF4195BF)
                    : Color(0xFF212121).withValues(alpha: 0.6),
              ),
            ),
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected
                    ? Color(0xFF4195BF)
                    : Color(0xFF212121).withValues(alpha: 0.6),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCenterButton(BuildContext context, HomeProvider homeProvider) {
    return GestureDetector(
      onTap: () {
        // Open the Add Request options modal for housekeeping (bottom sheet)
        showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          isScrollControlled: true,
          builder: (context) => const AddRequestOptionsModal(),
        );
      },
      child: Container(
        width: 53.73,
        height: 52,
        decoration: BoxDecoration(
          color: Color(0xFF1F2A44), // Dark blue color as requested
          shape: BoxShape.circle,
        ),
        child: Center(
          child: SvgIcon(
            assetName: AppIcons.menuSquare,
            color: Colors.white,
            size: 24,
          ),
        ),
      ),
    );
  }
}
