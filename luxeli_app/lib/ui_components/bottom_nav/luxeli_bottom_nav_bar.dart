import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/home/providers/home_provider.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/add_request_options_modal.dart';

class LuxeliBottomNavBar extends StatelessWidget {
  const LuxeliBottomNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 388.96,
      height: 78.32,
      padding: const EdgeInsets.only(top: 8.32),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.fromBorderSide(
          BorderSide(
            width: 1.04,
            strokeAlign: BorderSide.strokeAlignOutside,
            color: Color(0xFFF5F2F1),
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x4CD0D9E5),
            blurRadius: 30,
            offset: Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 348,
            padding: const EdgeInsets.only(top: 8),
            decoration: BoxDecoration(color: Colors.white),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildNavItem(
                  context,
                  svgIconAsset: AppIcons.home,
                  label: 'Home',
                  index: 0,
                ),
                _buildNavItem(
                  context,
                  svgIconAsset: AppIcons.file,
                  label: 'Requests',
                  index: 1,
                ),
                _buildCenterButton(context),
                _buildNavItem(
                  context,
                  svgIconAsset: AppIcons.statusError,
                  label: 'Support',
                  index: 3,
                ),
                _buildNavItem(
                  context,
                  svgIconAsset: AppIcons.userCircle,
                  label: 'Profile',
                  index: 4,
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required String svgIconAsset,
    required String label,
    required int index,
  }) {
    final homeProvider = context.watch<HomeProvider?>();
    final int selectedIndex = homeProvider?.selectedBottomNavIndex ?? 0;

    final bool isActive = selectedIndex == index;

    return GestureDetector(
      onTap: () {
        if (homeProvider != null) {
          homeProvider.setBottomNavIndex(index);
        }
      },
      child: SizedBox(
        width: 55,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 22,
              height: 22,
              padding: const EdgeInsets.all(1.83),
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(),
              child: SvgIcon(
                assetName: svgIconAsset,
                size: 18.33,
                color: isActive
                    ? Color(0xFF4195BF)
                    : Color(0xFF212121).withValues(alpha: 0.6),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                color: isActive
                    ? Color(0xFF4195BF)
                    : Color(0xFF212121).withValues(alpha: 0.6),
                fontSize: 11,
                fontFamily: 'Poppins',
                height: 0.13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCenterButton(BuildContext context) {
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
        width: 55,
        padding: const EdgeInsets.only(top: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              height: 52,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 53.76,
                    padding: const EdgeInsets.all(14),
                    decoration: ShapeDecoration(
                      color: Color(0xFF1F2A44),
                      shape: RoundedRectangleBorder(
                        side: BorderSide(
                          width: 3,
                          strokeAlign: BorderSide.strokeAlignOutside,
                          color: Colors.white,
                        ),
                        borderRadius: BorderRadius.circular(100),
                      ),
                      shadows: [
                        BoxShadow(
                          color: Color(0x19161A1D),
                          blurRadius: 64,
                          offset: Offset(0, 0),
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: SvgIcon(
                      assetName: AppIcons.menuSquare,
                      size: 24,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
