class ScanResult {
  final String id;
  final String status;
  final String userName;
  final String roomNumber;
  final String checkIn;
  final String checkOut;
  final String phoneNumber;
  final bool isAssigned;

  ScanResult({
    required this.id,
    required this.status,
    required this.userName,
    required this.roomNumber,
    required this.checkIn,
    required this.checkOut,
    required this.phoneNumber,
    required this.isAssigned,
  });

  factory ScanResult.fromQrData(String qrData) {
    try {
      if (qrData.startsWith('{') && qrData.endsWith('}')) {
        final cleanData = qrData.trim();
        final dataMap = _parseJsonString(cleanData);

        // Check for required fields (removed roomNumber requirement)
        final missingFields = <String>[];
        // Check for checkIn field (both checkIn and checkInDate for compatibility)
        final checkInValue = dataMap['checkIn'] ?? dataMap['checkInDate'] ?? '';
        if (checkInValue.isEmpty || checkInValue == 'Unknown') {
          missingFields.add('Check-in Date');
        }
        // Check for checkOut field (both checkOut and checkOutDate for compatibility)
        final checkOutValue =
            dataMap['checkOut'] ?? dataMap['checkOutDate'] ?? '';
        if (checkOutValue.isEmpty || checkOutValue == 'Unknown') {
          missingFields.add('Check-out Date');
        }

        // If any required fields are missing, return an error result
        if (missingFields.isNotEmpty) {
          return ScanResult(
            id: 'MISSING_FIELDS',
            status: 'incomplete',
            userName: dataMap['resident'] ?? dataMap['guestName'] ?? 'Guest',
            roomNumber:
                dataMap['roomNumber'] ?? dataMap['roomName'] ?? 'Unknown',
            checkIn: dataMap['checkIn'] ?? dataMap['checkInDate'] ?? 'Unknown',
            checkOut:
                dataMap['checkOut'] ?? dataMap['checkOutDate'] ?? 'Unknown',
            phoneNumber:
                dataMap['residentPhoneNo'] ?? dataMap['guestPhone'] ?? '',
            isAssigned: false,
          );
        }

        return ScanResult(
          id: dataMap['id'] ?? 'SCANNED_DATA',
          status: 'assigned',
          userName: dataMap['resident'] ?? dataMap['guestName'] ?? 'Guest',
          roomNumber: dataMap['roomNumber'] ?? dataMap['roomName'] ?? 'Unknown',
          checkIn: dataMap['checkIn'] ?? dataMap['checkInDate'] ?? 'Unknown',
          checkOut: dataMap['checkOut'] ?? dataMap['checkOutDate'] ?? 'Unknown',
          phoneNumber:
              dataMap['residentPhoneNo'] ?? dataMap['guestPhone'] ?? '',
          isAssigned: true,
        );
      } else {
        return ScanResult._fromKeyValueString(qrData);
      }
    } catch (e) {
      return ScanResult(
        id: 'PARSE_ERROR',
        status: 'error',
        userName: 'Parse Error',
        roomNumber: 'N/A',
        checkIn: 'N/A',
        checkOut: 'N/A',
        phoneNumber: 'N/A',
        isAssigned: false,
      );
    }
  }

  static Map<String, String> _parseJsonString(String json) {
    final result = <String, String>{};

    // Remove the outer braces
    final content = json.substring(1, json.length - 1);

    // Split by comma but be careful about commas in values
    // We need to handle this more carefully
    final pairs = <String>[];
    var currentPair = '';
    var inQuotes = false;

    for (var i = 0; i < content.length; i++) {
      final char = content[i];

      if (char == '"' && (i == 0 || content[i - 1] != '\\')) {
        inQuotes = !inQuotes;
      }

      if (char == ',' && !inQuotes) {
        pairs.add(currentPair);
        currentPair = '';
      } else {
        currentPair += char;
      }
    }

    if (currentPair.isNotEmpty) {
      pairs.add(currentPair);
    }

    // Now parse each key-value pair
    for (final pair in pairs) {
      final colonIndex = pair.indexOf(':');
      if (colonIndex != -1) {
        var key = pair.substring(0, colonIndex).trim();
        var value = pair.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if (key.startsWith('"') && key.endsWith('"')) {
          key = key.substring(1, key.length - 1);
        }
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }

        result[key] = value;
      }
    }

    return result;
  }

  factory ScanResult._fromKeyValueString(String qrData) {
    final dataMap = <String, String>{};
    final pairs = qrData.split(';');
    for (final pair in pairs) {
      final parts = pair.split(':');
      if (parts.length == 2) {
        dataMap[parts[0].trim()] = parts[1].trim();
      }
    }

    // Check for required fields in key-value format (removed room requirement)
    final missingFields = <String>[];
    // Check for checkin field (both checkin and checkInDate for compatibility)
    final checkInValue = dataMap['checkin'] ?? dataMap['checkInDate'] ?? '';
    if (checkInValue.isEmpty || checkInValue == 'Unknown') {
      missingFields.add('Check-in Date');
    }
    // Check for checkout field (both checkout and checkOutDate for compatibility)
    final checkOutValue = dataMap['checkout'] ?? dataMap['checkOutDate'] ?? '';
    if (checkOutValue.isEmpty || checkOutValue == 'Unknown') {
      missingFields.add('Check-out Date');
    }

    final status = dataMap['status'] ?? 'unassigned';
    final isAssigned =
        status.toLowerCase() == 'assigned' && missingFields.isEmpty;

    return ScanResult(
      id: dataMap['id'] ?? 'Unknown',
      status: missingFields.isEmpty ? status : 'incomplete',
      userName: dataMap['name'] ?? dataMap['guestName'] ?? 'Guest',
      roomNumber: dataMap['room'] ?? dataMap['roomName'] ?? 'Unknown',
      checkIn: dataMap['checkin'] ?? dataMap['checkInDate'] ?? 'Unknown',
      checkOut: dataMap['checkout'] ?? dataMap['checkOutDate'] ?? 'Unknown',
      phoneNumber: dataMap['phone'] ?? dataMap['guestPhone'] ?? '',
      isAssigned: isAssigned,
    );
  }

  factory ScanResult.error(String errorMessage) {
    return ScanResult(
      id: 'ERROR',
      status: 'error',
      userName: 'Scan Failed',
      roomNumber: 'N/A',
      checkIn: 'N/A',
      checkOut: 'N/A',
      phoneNumber: 'N/A',
      isAssigned: false,
    );
  }

  factory ScanResult.unassigned(String id) {
    return ScanResult(
      id: id,
      status: 'unassigned',
      userName: 'Unassigned Room',
      roomNumber: 'N/A',
      checkIn: 'N/A',
      checkOut: 'N/A',
      phoneNumber: 'N/A',
      isAssigned: false,
    );
  }

  // Method to get missing fields message (removed roomNumber requirement)
  String getMissingFieldsMessage() {
    final missingFields = <String>[];

    // Check for checkIn field (both checkIn and checkInDate for compatibility)
    if (checkIn == 'Unknown' || checkIn.isEmpty) {
      missingFields.add('Check-in Date');
    }
    // Check for checkOut field (both checkOut and checkOutDate for compatibility)
    if (checkOut == 'Unknown' || checkOut.isEmpty) {
      missingFields.add('Check-out Date');
    }

    if (missingFields.isEmpty) {
      return '';
    } else if (missingFields.length == 1) {
      return 'Missing required field: ${missingFields[0]}';
    } else {
      return 'Missing required fields: ${missingFields.join(', ')}';
    }
  }
}
