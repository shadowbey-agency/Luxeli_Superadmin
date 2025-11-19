# Network Configuration Setup

## Overview
This document explains the network configuration setup for the Luxeli Flutter application and how it connects to the Next.js backend.

## Configuration Files

### 1. AppConfig ([lib/core/constants/app_config.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/constants/app_config.dart))
The [AppConfig](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/constants/app_config.dart#L1-L42) class defines different environments with their respective API URLs:
- **Development**: `http://192.168.18.26:3000`
- **Staging**: `https://staging-api.luxeli.com`
- **Production**: `https://api.luxeli.com`

### 2. Network Utilities ([lib/core/utils/network_utils.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/utils/network_utils.dart))
Provides utility functions for:
- Building complete URLs from base URL and endpoints
- Checking internet connectivity
- Handling URL construction consistently across the app

### 3. Network Service ([lib/core/services/network_service.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/services/network_service.dart))
A service class that handles HTTP requests with proper error handling:
- GET, POST, PUT, DELETE methods
- Automatic URL construction using NetworkUtils
- Error handling for network issues and timeouts
- Logging in debug mode

### 4. AppProvider ([lib/providers/app_state_provider.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/providers/app_state_provider.dart))
Extends the configuration with:
- URL building methods
- Internet connectivity checking

## Setup Instructions

### 1. Update Development IP Address
When working on a different network, update the development IP address in [app_config.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/constants/app_config.dart):
1. Find your machine's IP address using `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update the `apiUrl` in the `dev` configuration

### 2. Android Network Permissions
The app already includes necessary permissions in [AndroidManifest.xml](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/android/app/src/main/AndroidManifest.xml):
- `INTERNET` permission for network access
- `ACCESS_NETWORK_STATE` for connectivity checking
- `usesCleartextTraffic="true"` to allow HTTP connections in development

### 3. Backend Configuration
The Next.js backend is configured to run on all interfaces (`0.0.0.0`) to accept connections from external devices.

## Testing
Run the network configuration tests with:
```
flutter test test/network_config_test.dart
```

## Troubleshooting

### Connection Issues
1. Verify the backend server is running (`npm run dev`)
2. Check that the IP address in [app_config.dart](file:///c%3A/Users/waqas/Documents/Luxeli_Superadmin/luxeli_app/lib/core/constants/app_config.dart) matches your machine's IP
3. Ensure both devices are on the same network
4. Check firewall settings on the development machine

### Android Emulator
When using the Android emulator, use `10.0.2.2` instead of `localhost` to connect to the host machine.