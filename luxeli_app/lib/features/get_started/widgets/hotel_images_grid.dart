import 'package:flutter/material.dart';
import 'package:luxeli_app/core/constants/app_images.dart';
import 'package:luxeli_app/core/utils/asset_helper.dart';

class HotelImagesGrid extends StatelessWidget {
  const HotelImagesGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 218,
      width: MediaQuery.of(context).size.width,
      child: Stack(
        children: [
          _buildLeftEdgeImage(top: -2, asset: AppImages.onboarding1),
          _buildLeftEdgeImage(top: 85, asset: AppImages.onboarding2),
          _buildLeftEdgeImage(top: 172, asset: AppImages.onboarding3),
          _buildRightEdgeImage(top: -2, asset: AppImages.onboarding4),
          _buildRightEdgeImage(top: 85, asset: AppImages.onboarding5),
          _buildRightEdgeImage(top: 172, asset: AppImages.onboarding1),
          _buildTopImage(
            left: 67,
            width: 80,
            height: 50,
            asset: AppImages.onboarding2,
          ),
          _buildTopImage(
            left: 156,
            width: 80,
            height: 87,
            asset: AppImages.onboarding3,
          ),
          _buildTopImage(
            left: 245,
            width: 80,
            height: 50,
            asset: AppImages.onboarding4,
          ),

          // Middle row images
          _buildMiddleImage(left: 67, top: 50, asset: AppImages.onboarding5),
          _buildMiddleImage(left: 156, top: 87, asset: AppImages.onboarding1),
          _buildMiddleImage(left: 245, top: 50, asset: AppImages.onboarding2),

          // Bottom row images
          _buildMiddleImage(left: 67, top: 138, asset: AppImages.onboarding3),
          _buildMiddleImage(left: 245, top: 138, asset: AppImages.onboarding4),
        ],
      ),
    );
  }

  Widget _buildLeftEdgeImage({required double top, required String asset}) {
    return Positioned(
      left: -6,
      top: top,
      child: Container(
        width: 64,
        height: 79,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(8),
            bottomRight: Radius.circular(8),
          ),
          image: DecorationImage(
            image: AssetImage(AssetHelper.normalizeAssetPath(asset)),
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildRightEdgeImage({required double top, required String asset}) {
    return Positioned(
      right: 2,
      top: top,
      child: Container(
        width: 64,
        height: 79,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(8),
            bottomLeft: Radius.circular(8),
          ),
          image: DecorationImage(
            image: AssetImage(AssetHelper.normalizeAssetPath(asset)),
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildTopImage({
    required double left,
    required double width,
    required double height,
    required String asset,
  }) {
    return Positioned(
      left: left,
      top: -8,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(8),
            bottomRight: Radius.circular(8),
          ),
          image: DecorationImage(
            image: AssetImage(AssetHelper.normalizeAssetPath(asset)),
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildMiddleImage({
    required double left,
    required double top,
    required String asset,
  }) {
    return Positioned(
      left: left,
      top: top,
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          image: DecorationImage(
            image: AssetImage(AssetHelper.normalizeAssetPath(asset)),
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
