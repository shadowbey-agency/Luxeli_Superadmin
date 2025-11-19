import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/service.dart';

class ServiceDetailsModal extends StatelessWidget {
  final Service service;
  final VoidCallback onBookNowPressed;

  const ServiceDetailsModal({
    super.key,
    required this.service,
    required this.onBookNowPressed,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'en_US',
      symbol: '\$',
    );
    final dateFormatter = DateFormat('MMM d, y');

    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Service details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(12.0),
            child: Image.network(
              service.imageUrl,
              height: 180,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 180,
                  width: double.infinity,
                  color: Colors.grey[300],
                  child: Icon(Icons.image, color: Colors.grey[600]),
                );
              },
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) return child;
                return Container(
                  height: 180,
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
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    service.location,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
              Text(
                dateFormatter.format(service.availableDate),
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                service.name,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  service.category,
                  style: TextStyle(color: Colors.grey[700], fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            service.description,
            style: TextStyle(color: Colors.grey[700], fontSize: 14),
          ),
          const SizedBox(height: 16),
          Text(
            service.price == 0
                ? 'FREE'
                : currencyFormatter.format(service.price),
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0D47A1), // Dark blue
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onBookNowPressed,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D47A1), // Dark blue
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Book now', style: TextStyle(fontSize: 16)),
            ),
          ),
        ],
      ),
    );
  }
}
