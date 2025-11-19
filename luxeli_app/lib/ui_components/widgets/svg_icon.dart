import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SvgIcon extends StatelessWidget {
  final String assetName;
  final double? size;
  final Color? color;
  final BoxFit fit;
  final IconData? fallbackIcon; // Add fallback icon

  const SvgIcon({
    super.key,
    required this.assetName,
    this.size,
    this.color,
    this.fit = BoxFit.contain,
    this.fallbackIcon, // Optional fallback icon
  });

  @override
  Widget build(BuildContext context) {
    // If we have a fallback icon, use it as a backup
    if (fallbackIcon != null) {
      try {
        return SvgPicture.asset(
          assetName,
          width: size,
          height: size,
          colorFilter: color != null
              ? ColorFilter.mode(color!, BlendMode.srcIn)
              : null,
          fit: fit,
          placeholderBuilder: (context) =>
              Icon(fallbackIcon, size: size, color: color),
        );
      } catch (e) {
        // If SVG fails, fall back to the icon
        return Icon(fallbackIcon, size: size, color: color);
      }
    } else {
      // Original behavior without fallback
      return SvgPicture.asset(
        assetName,
        width: size,
        height: size,
        colorFilter: color != null
            ? ColorFilter.mode(color!, BlendMode.srcIn)
            : null,
        fit: fit,
        placeholderBuilder: (context) => Container(
          width: size,
          height: size,
          color: Colors.grey[300],
          child: const Icon(Icons.error, color: Colors.red),
        ),
      );
    }
  }
}
