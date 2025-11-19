import 'package:flutter/material.dart';
import 'package:luxeli_app/features/housekeeping/widgets/cleaning_request_modal.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/add_request_options_modal.dart';

class CleaningScheduleScreen extends StatefulWidget {
  const CleaningScheduleScreen({super.key});

  @override
  _CleaningScheduleScreenState createState() => _CleaningScheduleScreenState();
}

class _CleaningScheduleScreenState extends State<CleaningScheduleScreen> {
  late List<DateTime> selectedDates;

  @override
  void initState() {
    super.initState();
    selectedDates = _generateNextFiveDates();
  }

  List<DateTime> _generateNextFiveDates() {
    final now = DateTime.now();
    return List.generate(
      5,
      (index) => DateTime(now.year, now.month, now.day + index),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        height: MediaQuery.of(context).size.height * 0.9, // Half screen height
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SizedBox(width: 44), // Spacer for alignment
                  Text(
                    'Request cleaning',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, color: Color(0xFF757575)),
                    onPressed: () {
                      // Close current screen and open AddRequestOptionsModal as a centered dialog
                      Navigator.of(context).pop();
                      showDialog(
                        context: context,
                        barrierColor: Colors.black54,
                        builder: (context) => Center(
                          child: SingleChildScrollView(
                            child: AddRequestOptionsModal(),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Tell us when you\'d like your room to be cleaned and any special instructions.',
                style: TextStyle(
                  color: Colors.grey[700],
                  fontSize: 16,
                  height: 1.4,
                ),
              ),

              SizedBox(height: 24),

              // Schedule section header
              Text(
                'Schedule section',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),

              SizedBox(height: 8),

              // Schedule description
              Text(
                'Choose your preferred cleaning time for one day or set it for multiple days.',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                  height: 1.4,
                ),
              ),

              SizedBox(height: 16),

              // Date cards
              Column(
                children: selectedDates.asMap().entries.map((entry) {
                  int index = entry.key;
                  bool isFirstCard = index == 0;
                  DateTime date = entry.value;

                  return Container(
                    margin: EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Padding(
                          padding: EdgeInsets.all(16),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Date
                                    Text(
                                      _formatDate(date),
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black,
                                      ),
                                    ),

                                    SizedBox(height: 8),

                                    // Cleaning Type label
                                    Text(
                                      'Cleaning Type',
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 14,
                                      ),
                                    ),

                                    // Cleaning Type value (only for first card)
                                    if (isFirstCard) ...[
                                      SizedBox(height: 4),
                                      Text(
                                        'Full Room',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],

                                    SizedBox(height: 8),

                                    // Time label
                                    Text(
                                      'Time',
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 14,
                                      ),
                                    ),

                                    // Time value (only for first card)
                                    if (isFirstCard) ...[
                                      SizedBox(height: 4),
                                      Text(
                                        '03:00 PM - 03:30 PM',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),

                              // Edit icon (only for first card)
                              if (isFirstCard)
                                IconButton(
                                  icon: Icon(
                                    Icons.edit_outlined,
                                    color: Colors.blue[800],
                                    size: 20,
                                  ),
                                  onPressed: () {},
                                  padding: EdgeInsets.zero,
                                  constraints: BoxConstraints(),
                                ),

                              // Plus icon for other cards
                              if (!isFirstCard)
                                IconButton(
                                  icon: Icon(
                                    Icons.add,
                                    color: Colors.grey[600],
                                    size: 20,
                                  ),
                                  onPressed: () {
                                    // Open AddRequestOptionsModal as a centered card dialog
                                    Navigator.of(context).pop();
                                    showDialog(
                                      context: context,
                                      barrierColor: Colors.black54,
                                      builder: (context) => Center(
                                        child: SingleChildScrollView(
                                          child: CleaningRequestModal(),
                                        ),
                                      ),
                                    );
                                  },
                                  padding: EdgeInsets.zero,
                                  constraints: BoxConstraints(),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),

              SizedBox(height: 32),

              // Send request button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[800],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    'Send request',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
