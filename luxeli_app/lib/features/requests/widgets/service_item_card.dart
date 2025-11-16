import 'package:flutter/material.dart';
import 'package:luxeli_app/features/home/models/activity_model.dart';
import 'package:luxeli_app/features/home/providers/home_provider.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/core/utils/asset_helper.dart';

class ServiceItemCard extends StatelessWidget {
  final ServiceItemModel item;

  const ServiceItemCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        minWidth: 112, // Figma width
        minHeight: 98, // Figma height
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color.fromARGB(255, 190, 208, 218), Color(0xFF56C6FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        margin: EdgeInsets.all(1), // Inner margin to show the gradient border
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14), // Slightly smaller radius
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with Price Badge
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(14),
                    topRight: Radius.circular(14),
                  ),
                  child: Container(
                    height: 135,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage(
                          AssetHelper.normalizeAssetPath(item.imagePath),
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: item.isFree
                          ? Color(0xFF00B087)
                          : Color(0xFFEC1C2C),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item.isFree ? '0\$' : '${item.price}\$',
                      style: TextStyle(
                        fontFamily: 'Fustat',
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    item.title,
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Colors.black,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4),

                  // Description
                  Text(
                    item.description,
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Colors.black.withValues(alpha: 0.6),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 12),

                  // Request Button
                  GestureDetector(
                    onTap: () {
                      context.read<HomeProvider>().requestService(item.id);
                    },
                    child: Container(
                      width: double.infinity,
                      padding: EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: Color(0xFF01286B),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          'Request',
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
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
