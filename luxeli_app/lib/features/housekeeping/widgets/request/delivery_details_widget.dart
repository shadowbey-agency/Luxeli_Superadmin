import 'package:flutter/material.dart';

class DeliveryDetailsWidget extends StatefulWidget {
  final Function(String) onDeliveryMethodChanged;
  final Function(bool) onPickTime;
  final String deliveryMethod;
  final TimeOfDay? startTime;
  final TimeOfDay? endTime;
  final String priority;
  final Function(String) onPriorityChanged;

  const DeliveryDetailsWidget({
    super.key,
    required this.onDeliveryMethodChanged,
    required this.onPickTime,
    required this.deliveryMethod,
    required this.startTime,
    required this.endTime,
    required this.priority,
    required this.onPriorityChanged,
  });

  @override
  State<DeliveryDetailsWidget> createState() => _DeliveryDetailsWidgetState();
}

class _DeliveryDetailsWidgetState extends State<DeliveryDetailsWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Delivery method'),
            trailing: DropdownButton<String>(
              value: widget.deliveryMethod,
              items: [
                DropdownMenuItem(
                  value: 'Drop at door',
                  child: Text('Drop at door'),
                ),
                DropdownMenuItem(
                  value: 'Hand to staff',
                  child: Text('Hand to staff'),
                ),
              ],
              onChanged: (value) => widget.onDeliveryMethodChanged(value!),
            ),
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Time window'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextButton(
                  onPressed: () => widget.onPickTime(true),
                  child: Text(widget.startTime?.format(context) ?? 'Start'),
                ),
                Text(' - '),
                TextButton(
                  onPressed: () => widget.onPickTime(false),
                  child: Text(widget.endTime?.format(context) ?? 'End'),
                ),
              ],
            ),
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text('Priority'),
            trailing: DropdownButton<String>(
              value: widget.priority,
              items: [
                DropdownMenuItem(value: 'Normal', child: Text('Normal')),
                DropdownMenuItem(value: 'High', child: Text('High')),
              ],
              onChanged: (value) => widget.onPriorityChanged(value!),
            ),
          ),
        ],
      ),
    );
  }
}
