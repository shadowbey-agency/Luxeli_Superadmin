import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/cleaning_services/models/cleaning_service_model.dart';
import 'package:luxeli_app/features/cleaning_services/providers/cleaning_service_provider.dart';
import 'package:luxeli_app/core/utils/asset_helper.dart';
import 'package:luxeli_app/ui_components/buttons/primary_button.dart';

class CleaningServiceDetailScreen extends StatelessWidget {
  final CleaningServiceModel service;

  const CleaningServiceDetailScreen({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF1F2A44),
      body: Stack(
        children: [
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                AppBar(
                  title: Text('Service Details'),
                  backgroundColor: Color(0xFF1F2A44),
                  leading: IconButton(
                    icon: Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Service image
                            Container(
                              height: 200,
                              decoration: BoxDecoration(
                                color: Color(0xFFFBFAFA),
                                borderRadius: BorderRadius.circular(12),
                                image: service.imagePath.isNotEmpty
                                    ? DecorationImage(
                                        image: AssetImage(AssetHelper.normalizeAssetPath(service.imagePath)),
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                              child: service.imagePath.isEmpty
                                  ? Icon(
                                      Icons.cleaning_services,
                                      size: 80,
                                      color: Color(0xFF1F2A44),
                                    )
                                  : null,
                            ),
                            SizedBox(height: 20),
                            // Service title and price
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    service.title,
                                    style: TextStyle(
                                      fontFamily: 'Fustat',
                                      fontSize: 24,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.black,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: service.isFree
                                        ? Color(0xFF4CAF50)
                                        : Color(0xFF1F2A44),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    service.isFree
                                        ? 'FREE'
                                        : '\$${service.price.toStringAsFixed(0)}',
                                    style: TextStyle(
                                      fontFamily: 'Fustat',
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 12),
                            // Service description
                            Text(
                              service.description,
                              style: TextStyle(
                                fontFamily: 'Fustat',
                                fontSize: 16,
                                fontWeight: FontWeight.w400,
                                color: Colors.black.withValues(alpha: 0.8),
                              ),
                            ),
                            SizedBox(height: 20),
                            // Service details
                            _buildDetailRow(
                              icon: Icons.access_time,
                              label: 'Duration',
                              value: '${service.duration} minutes',
                            ),
                            SizedBox(height: 12),
                            _buildDetailRow(
                              icon: Icons.star,
                              label: 'Service Level',
                              value: service.isFree ? 'Basic' : 'Premium',
                            ),
                            SizedBox(height: 32),
                            // Request button
                            PrimaryButton(
                              text: 'Request Service',
                              onPressed: () {
                                context
                                    .read<CleaningServiceProvider>()
                                    .requestService(service);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                        'Service requested: ${service.title}'),
                                    backgroundColor: Color(0xFF4CAF50),
                                  ),
                                );
                                // Navigate back after a short delay
                                Future.delayed(Duration(seconds: 2), () {
                                  Navigator.of(context).pop();
                                });
                              },
                            ),
                          ],
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
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Color(0xFF1F2A44)),
        SizedBox(width: 12),
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.black,
          ),
        ),
        Spacer(),
        Text(
          value,
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1F2A44),
          ),
        ),
      ],
    );
  }
}