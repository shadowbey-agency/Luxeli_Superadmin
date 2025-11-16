import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/cleaning_services/providers/cleaning_service_provider.dart';
import 'package:luxeli_app/features/cleaning_services/models/cleaning_service_model.dart';
import 'package:luxeli_app/core/utils/asset_helper.dart';

class CleaningServicesScreen extends StatelessWidget {
  const CleaningServicesScreen({super.key});

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
                  title: Text('Cleaning Services'),
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
                      child: Consumer<CleaningServiceProvider>(
                        builder: (context, provider, child) {
                          if (provider.isLoading) {
                            return Center(child: CircularProgressIndicator());
                          }

                          if (provider.services.isEmpty) {
                            return Center(
                              child: Text(
                                'No cleaning services available',
                                style: TextStyle(
                                  fontFamily: 'Fustat',
                                  fontSize: 16,
                                  color: Colors.black.withValues(alpha: 0.6),
                                ),
                              ),
                            );
                          }

                          return ListView.builder(
                            padding: EdgeInsets.all(20),
                            itemCount: provider.services.length,
                            itemBuilder: (context, index) {
                              return _buildServiceCard(
                                context,
                                provider.services[index],
                              );
                            },
                          );
                        },
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

  Widget _buildServiceCard(BuildContext context, CleaningServiceModel service) {
    return GestureDetector(
      onTap: () {
        // Show a simple dialog for now
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Selected: ${service.title}')),
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Color(0xFFE8E8E8), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Service image
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: Color(0xFFFBFAFA),
                borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
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
                      size: 40,
                      color: Color(0xFF1F2A44),
                    )
                  : null,
            ),
            // Service details
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          service.title,
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.black,
                          ),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: service.isFree
                              ? Color(0xFF4CAF50)
                              : Color(0xFF1F2A44),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          service.isFree ? 'FREE' : '\$${service.price.toStringAsFixed(0)}',
                          style: TextStyle(
                            fontFamily: 'Fustat',
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    service.description,
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: Colors.black.withValues(alpha: 0.6),
                    ),
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: Color(0xFF1F2A44),
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${service.duration} min',
                        style: TextStyle(
                          fontFamily: 'Fustat',
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF1F2A44),
                        ),
                      ),
                      SizedBox(width: 16),
                      if (!service.isAvailable)
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.red.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'Not Available',
                            style: TextStyle(
                              fontFamily: 'Fustat',
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Colors.red,
                            ),
                          ),
                        ),
                    ],
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