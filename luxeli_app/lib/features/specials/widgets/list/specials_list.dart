import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:luxeli_app/features/specials/models/customized_service_request.dart';
import 'package:luxeli_app/features/specials/providers/specials_provider.dart';
import 'package:luxeli_app/features/specials/widgets/list/special_request_card.dart';

class SpecialsList extends StatelessWidget {
  const SpecialsList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<SpecialsProvider>(
      builder: (context, provider, child) {
        final List<CustomizedServiceRequest> requests = provider.requests;
        if (requests.isEmpty) {
          return _buildNoRequestsState();
        }

        final Map<String, List<CustomizedServiceRequest>> groupedRequests = {};
        final now = DateTime.now();
        final today = DateTime(now.year, now.month, now.day);
        final yesterday = DateTime(now.year, now.month, now.day - 1);

        for (var request in requests) {
          final requestDate = DateTime(
            request.createdAt.year,
            request.createdAt.month,
            request.createdAt.day,
          );
          String dateKey;
          if (requestDate.isAtSameMomentAs(today)) {
            dateKey = 'Today';
          } else if (requestDate.isAtSameMomentAs(yesterday)) {
            dateKey = 'Yesterday';
          } else {
            dateKey = DateFormat('dd/MM/yyyy').format(request.createdAt);
          }
          groupedRequests.putIfAbsent(dateKey, () => []).add(request);
        }

        final sortedKeys = groupedRequests.keys.toList();
        sortedKeys.sort((a, b) {
          if (a == 'Today') return -1;
          if (b == 'Today') return 1;
          if (a == 'Yesterday') return -1;
          if (b == 'Yesterday') return 1;
          try {
            final dateA = DateFormat('dd/MM/yyyy').parse(a);
            final dateB = DateFormat('dd/MM/yyyy').parse(b);
            return dateB.compareTo(dateA);
          } catch (e) {
            return 0;
          }
        });

        return ListView.builder(
          itemCount: sortedKeys.length,
          itemBuilder: (context, index) {
            final dateKey = sortedKeys[index];
            final requestsForDate = groupedRequests[dateKey]!;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  child: Text(
                    dateKey,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF333333),
                    ),
                  ),
                ),
                Divider(
                  endIndent: 16,
                  indent: 16,
                  thickness: 1,
                  color: Color(0xFFE0E0E0),
                ),
                ...requestsForDate.map(
                  (request) => SpecialRequestCard(request: request),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildNoRequestsState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFE3F2FD),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFBBDEFB), width: 2),
            ),
            child: PngIcon(
              assetName: 'assets/images/icons/specialicon.png',
              width: 40,
              height: 40,
              fallbackIcon: Icons.star,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'No requests available',
            style: TextStyle(fontSize: 16, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }
}
