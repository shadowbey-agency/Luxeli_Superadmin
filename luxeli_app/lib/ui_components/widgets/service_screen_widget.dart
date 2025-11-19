import 'package:flutter/material.dart';
import 'package:luxeli_app/ui_components/widgets/svg_icon.dart';
import 'package:luxeli_app/ui_components/widgets/png_icon.dart';
import 'package:luxeli_app/core/constants/app_icons.dart';

class ServiceScreenWidget extends StatelessWidget {
  final String title;
  final String serviceTitle;
  final String description;
  final String assetName;
  final IconData fallbackIcon;
  final Widget Function(BuildContext) buildContent;
  final VoidCallback onAddRequest;
  final String addRequestButtonText;
  final bool showFilterIcon;

  const ServiceScreenWidget({
    super.key,
    required this.title,
    required this.serviceTitle,
    required this.description,
    required this.assetName,
    required this.fallbackIcon,
    required this.buildContent,
    required this.onAddRequest,
    this.addRequestButtonText = 'Add new request',
    this.showFilterIcon = true,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF333333),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        flex: 2,
                        child: Padding(
                          padding: const EdgeInsets.only(left: 16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                serviceTitle,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                description,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFF666666),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Flexible(
                        flex: 1,
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: PngIcon(
                            assetName: assetName,
                            width: 100,
                            height: 100,
                            fallbackIcon: fallbackIcon,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: Colors.grey)),
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(18.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Requests',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF333333),
                            ),
                          ),
                          if (showFilterIcon)
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xffFBFAFA),
                                border: Border.all(
                                  color: Colors.grey.withOpacity(0.5),
                                ),
                                shape: BoxShape.circle,
                              ),
                              child: GestureDetector(
                                onTap: () {},
                                child: SvgIcon(
                                  assetName: AppIcons.filter,
                                  size: 16,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    Expanded(child: buildContent(context)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ElevatedButton(
          onPressed: onAddRequest,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF2196F3),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: Text(
            addRequestButtonText,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
