import 'package:flutter/material.dart';

class CategorySelectorWidget extends StatelessWidget {
  final List<String> categories;
  final int selectedCategoryIndex;

  const CategorySelectorWidget({
    super.key,
    required this.categories,
    required this.selectedCategoryIndex,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, i) {
          final bool active = i == selectedCategoryIndex;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: active ? Colors.grey.shade200 : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(
              categories[i],
              style: TextStyle(
                color: active ? Colors.black : Colors.grey.shade700,
              ),
            ),
          );
        },
      ),
    );
  }
}
