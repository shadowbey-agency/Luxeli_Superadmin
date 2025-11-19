import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // For currency formatting

import '../models/service.dart';

class ServiceCard extends StatelessWidget {
  final Service service;
  final VoidCallback onBookPressed;

  const ServiceCard({
    super.key,
    required this.service,
    required this.onBookPressed,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'en_US',
      symbol: '\$',
    );

    return Card(
      margin: const EdgeInsets.all(8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      elevation: 2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12.0),
                ),
                child: _buildServiceImage(service.imageUrl),
              ),
              Positioned(
                top: 8,
                left: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    service.price == 0
                        ? 'FREE'
                        : currencyFormatter.format(service.price),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ],
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          service.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Expanded(
                          child: Text(
                            service.description,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: onBookPressed,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0D47A1), // Dark blue
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Book'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper method to build the service image, handling both asset and network images
  Widget _buildServiceImage(String imageUrl) {
    // Check if it's an asset path (starts with assets/)
    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        height: 120,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            height: 120,
            width: double.infinity,
            color: Colors.grey[300],
            child: Icon(Icons.image, color: Colors.grey[600]),
          );
        },
      );
    } else {
      // It's a network image
      return Image.network(
        imageUrl,
        height: 120,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            height: 120,
            width: double.infinity,
            color: Colors.grey[300],
            child: Icon(Icons.image, color: Colors.grey[600]),
          );
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Container(
            height: 120,
            width: double.infinity,
            color: Colors.grey[300],
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                          loadingProgress.expectedTotalBytes!
                    : null,
              ),
            ),
          );
        },
      );
    }
  }
}
