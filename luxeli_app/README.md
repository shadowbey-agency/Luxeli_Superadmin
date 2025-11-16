# Luxeli App

## Running the App in Different Environments

### Development Environment
```bash
flutter run -t lib/main_dev.dart
```

### Staging Environment
```bash
flutter run -t lib/main_staging.dart
```

### Production Environment
```bash
flutter run -t lib/main_prod.dart
```

## Building for Different Environments

### Development Build
```bash
flutter build apk -t lib/main_dev.dart --release
```

### Staging Build
```bash
flutter build apk -t lib/main_staging.dart --release
```

### Production Build
```bash
flutter build apk -t lib/main_prod.dart --release
```

## Environment Configurations

- **Development**: Uses development API endpoints with debug features enabled
- **Staging**: Uses staging API endpoints with debug features enabled
- **Production**: Uses production API endpoints with debug features disabled

## Folder Structure

```
lib/
├── main.dart
├── main_dev.dart
├── main_staging.dart
├── main_prod.dart
├── core/
│   └── constants/
│       └── app_config.dart
├── providers/
│   └── app_provider.dart
├── features/
│   └── splash/
│       ├── providers/
│       │   └── splash_provider.dart
│       └── views/
│           └── splash_screen.dart
```