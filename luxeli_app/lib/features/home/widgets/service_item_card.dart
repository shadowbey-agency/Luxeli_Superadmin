import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/activity_model.dart';
import '../providers/home_provider.dart';
import 'package:luxeli_app/core/utils/asset_helper.dart';

class ServiceItemCard extends StatelessWidget {
  final ServiceItemModel item;

  const ServiceItemCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey, width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.all(Radius.circular(12)),
                  child: Container(
                    height: 120,
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
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: item.isFree ? Color(0xFFEC1C2C) : Color(0xFFEC1C2C),
                    borderRadius: BorderRadius.circular(6),
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
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
                  SizedBox(height: 2),
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
                  SizedBox(height: 8),
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
