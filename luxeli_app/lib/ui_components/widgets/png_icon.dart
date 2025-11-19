import 'package:flutter/material.dart';

class PngIcon extends StatelessWidget {
  final String assetName;
  final double? width;
  final double? height;
  final Color? color;
  final BoxFit fit;
  final IconData? fallbackIcon;

  const PngIcon({
    super.key,
    required this.assetName,
    this.width,
    this.height,
    this.color,
    this.fit = BoxFit.contain,
    this.fallbackIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      assetName,
      width: width,
      height: height,
      color: color,
      fit: fit,
    );
  }
}
