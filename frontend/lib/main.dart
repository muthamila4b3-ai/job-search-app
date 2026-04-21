import 'package:flutter/material.dart';
import 'screens/job_list_screen.dart';
import 'screens/login_screen.dart';
import 'screens/subscription_screen.dart';
import 'services/api_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String? _token;
  String _subscriptionPlan = 'Silver';
  final ApiService _apiService = ApiService();

  void _onLogin(String token, String subscriptionPlan) {
    setState(() {
      _token = token;
      _subscriptionPlan = subscriptionPlan;
    });
  }

  void _onLogout() {
    setState(() {
      _token = null;
    });
  }

  void _onSubscriptionUpdated(String planName) {
    setState(() {
      _subscriptionPlan = planName;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Job Search App',
      theme: ThemeData(primarySwatch: Colors.indigo),
      home: _token == null
          ? LoginScreen(onLogin: _onLogin)
          : JobListScreen(
              token: _token!,
              subscriptionPlan: _subscriptionPlan,
              onLogout: _onLogout,
              onSubscriptionTap: () async {
                final updatedPlan = await Navigator.of(context).push<String>(
                  MaterialPageRoute(
                    builder: (context) => SubscriptionScreen(
                      token: _token!,
                      currentPlan: _subscriptionPlan,
                    ),
                  ),
                );
                if (updatedPlan != null) {
                  _onSubscriptionUpdated(updatedPlan);
                }
              },
            ),
    );
  }
}
