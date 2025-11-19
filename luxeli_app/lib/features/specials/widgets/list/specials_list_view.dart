import 'package:flutter/material.dart';
import 'package:luxeli_app/features/specials/views/specials_screen.dart';

class SpecialsListView extends StatefulWidget {
  const SpecialsListView({super.key});

  @override
  State<SpecialsListView> createState() => _SpecialsListViewState();
}

class _SpecialsListViewState extends State<SpecialsListView> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();

  void _sendRequest() async {
    final title = _titleController.text.trim();
    final desc = _descController.text.trim();

    if (title.isEmpty || desc.isEmpty) {
      // Show validation error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please fill in all fields'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
      return;
    }

    // Simulate API call
    bool success = await Future.delayed(const Duration(seconds: 1), () => true);

    if (success) {
      // Navigate to SpecialsScreen for Specials so the user sees the list
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const SpecialsScreen()),
      );

      // Show success confirmation
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Special request submitted successfully!'),
          duration: const Duration(seconds: 2),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Failed to submit request. Please try again.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox(width: 44),
                        Text(
                          'Customized request',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tell us what you need, and our team will take care of it.',
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 18),

                    const Divider(height: 1),
                    const SizedBox(height: 16),

                    const Text(
                      'Title',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: TextField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          hintText: 'Write here...',
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      'Description',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        child: TextField(
                          controller: _descController,
                          maxLines: null,
                          expands: true,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Write here...',
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),

            Container(
              color: Colors.transparent,
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _sendRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A3B78),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Send request',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
