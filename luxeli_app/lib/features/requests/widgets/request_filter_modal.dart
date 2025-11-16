import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/request_model.dart';
import '../providers/request_provider.dart';

class RequestFilterModal extends StatelessWidget {
  const RequestFilterModal({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.read<RequestProvider>().closeFilterModal();
      },
      child: Container(
        color: Colors.black.withValues(alpha: 0.5),
        child: GestureDetector(
          onTap: () {},
          child: Center(child: _FilterContent()),
        ),
      ),
    );
  }
}

class _FilterContent extends StatefulWidget {
  const _FilterContent();

  @override
  State<_FilterContent> createState() => _FilterContentState();
}

class _FilterContentState extends State<_FilterContent> {
  RequestType? _selectedService;
  RequestStatus? _selectedStatus;
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();
    final currentFilter = context.read<RequestProvider>().currentFilter;
    _selectedService = currentFilter.serviceType;
    _selectedStatus = currentFilter.status;
    _selectedDate = currentFilter.date;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter',
                style: TextStyle(
                  fontFamily: 'Fustat',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),
              GestureDetector(
                onTap: () {
                  context.read<RequestProvider>().closeFilterModal();
                },
                child: Icon(Icons.close, size: 24, color: Colors.black),
              ),
            ],
          ),

          SizedBox(height: 20),

          // Service Dropdown
          _buildDropdown(
            label: 'Service',
            value: _selectedService != null
                ? _getServiceTypeText(_selectedService!)
                : null,
            hint: 'Select',
            onTap: () => _showServicePicker(context),
          ),

          SizedBox(height: 16),

          // Status Dropdown
          _buildDropdown(
            label: 'Status',
            value: _selectedStatus != null
                ? _getStatusText(_selectedStatus!)
                : null,
            hint: 'Select',
            onTap: () => _showStatusPicker(context),
          ),

          SizedBox(height: 16),

          // Date Picker
          _buildDatePicker(
            label: 'Date',
            value: _selectedDate != null
                ? DateFormat('dd/MM/yyyy').format(_selectedDate!)
                : null,
            hint: 'Select date',
            onTap: () => _selectDate(context),
          ),

          SizedBox(height: 24),

          // Apply Button
          GestureDetector(
            onTap: () {
              final filter = RequestFilter(
                serviceType: _selectedService,
                status: _selectedStatus,
                date: _selectedDate,
              );
              context.read<RequestProvider>().applyFilter(filter);
            },
            child: Container(
              width: double.infinity,
              padding: EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: Color(0xFF01286B),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  'Apply',
                  style: TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    String? value,
    required String hint,
    required VoidCallback onTap,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black,
          ),
        ),
        SizedBox(height: 8),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Color(0xFFF8F8F8),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  value ?? hint,
                  style: TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: value != null
                        ? Colors.black
                        : Colors.black.withValues(alpha: 0.4),
                  ),
                ),
                Icon(
                  Icons.keyboard_arrow_down,
                  size: 20,
                  color: Colors.black.withValues(alpha: 0.6),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDatePicker({
    required String label,
    String? value,
    required String hint,
    required VoidCallback onTap,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Fustat',
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black,
          ),
        ),
        SizedBox(height: 8),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Color(0xFFF8F8F8),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  value ?? hint,
                  style: TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: value != null
                        ? Colors.black
                        : Colors.black.withValues(alpha: 0.4),
                  ),
                ),
                Icon(
                  Icons.calendar_today_outlined,
                  size: 18,
                  color: Colors.black.withValues(alpha: 0.6),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _showServicePicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext sheetContext) {
        return Container(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ...RequestType.values.map((type) {
                return ListTile(
                  title: Text(_getServiceTypeText(type)),
                  onTap: () {
                    setState(() {
                      _selectedService = type;
                    });
                    Navigator.pop(sheetContext);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  void _showStatusPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext sheetContext) {
        return Container(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ...RequestStatus.values.map((status) {
                return ListTile(
                  title: Text(_getStatusText(status)),
                  onTap: () {
                    setState(() {
                      _selectedStatus = status;
                    });
                    Navigator.pop(sheetContext);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  String _getServiceTypeText(RequestType type) {
    switch (type) {
      case RequestType.housekeeping:
        return 'Housekeeping';
      case RequestType.laundry:
        return 'Laundry';
      case RequestType.delivery:
        return 'Delivery';
      case RequestType.roomService:
        return 'Room Service';
      case RequestType.maintenance:
        return 'Maintenance';
    }
  }

  String _getStatusText(RequestStatus status) {
    switch (status) {
      case RequestStatus.pending:
        return 'Pending';
      case RequestStatus.completed:
        return 'Completed';
      case RequestStatus.cancelled:
        return 'Cancelled';
    }
  }
}
