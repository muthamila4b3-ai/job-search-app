import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SubscriptionScreen extends StatefulWidget {
  final String token;
  final String currentPlan;

  const SubscriptionScreen({super.key, required this.token, required this.currentPlan});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  late Future<List<dynamic>> _plansFuture;
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _plansFuture = _apiService.fetchSubscriptions();
  }

  Future<void> _subscribe(int planId) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final planName = await _apiService.subscribePlan(widget.token, planId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Subscribed to $planName successfully.')),
      );
      Navigator.of(context).pop(planName);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Subscription Plans')),
      body: FutureBuilder<List<dynamic>>(
        future: _plansFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final plans = snapshot.data ?? [];
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: plans.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final plan = plans[index] as Map<String, dynamic>;
              final planName = plan['name'] as String;
              final isCurrent = planName == widget.currentPlan;
              return Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(planName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text(plan['price'] ?? '', style: const TextStyle(fontSize: 16, color: Colors.indigo)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(plan['benefits'] ?? ''),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: ElevatedButton(
                          onPressed: isCurrent || _isLoading ? null : () => _subscribe(plan['id'] as int),
                          child: _isLoading
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                              : Text(isCurrent ? 'Current plan' : 'Subscribe'),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
