import 'package:flutter/material.dart';
import '../services/api_service.dart';

class JobListScreen extends StatefulWidget {
  final String token;
  final String subscriptionPlan;
  final VoidCallback onLogout;
  final VoidCallback onSubscriptionTap;

  const JobListScreen({
    super.key,
    required this.token,
    required this.subscriptionPlan,
    required this.onLogout,
    required this.onSubscriptionTap,
  });

  @override
  State<JobListScreen> createState() => _JobListScreenState();
}

class _JobListScreenState extends State<JobListScreen> {
  late Future<List<dynamic>> _jobsFuture;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _jobsFuture = _apiService.fetchJobs();
  }

  Future<void> _apply(int jobId) async {
    try {
      await _apiService.applyJob(widget.token, jobId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Application sent successfully.')),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Job Listings'),
        actions: [
          TextButton(
            onPressed: widget.onSubscriptionTap,
            child: Text(
              widget.subscriptionPlan,
              style: const TextStyle(color: Colors.white),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: widget.onLogout,
          ),
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _jobsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final jobs = snapshot.data ?? [];
          if (jobs.isEmpty) {
            return const Center(child: Text('No jobs available.'));
          }
          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _jobsFuture = _apiService.fetchJobs();
              });
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: jobs.length,
              itemBuilder: (context, index) {
                final job = jobs[index] as Map<String, dynamic>;
                return Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(job['title'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 6),
                        Text('${job['company']} • ${job['location']}', style: const TextStyle(color: Colors.grey)),
                        const SizedBox(height: 8),
                        Text(job['description'] ?? ''),
                        const SizedBox(height: 8),
                        Text('Salary: ${job['salary'] ?? 'Competitive'}'),
                        const SizedBox(height: 8),
                        Text(job['remote'] == 1 || job['remote'] == true ? 'Remote friendly' : 'Onsite role'),
                        const SizedBox(height: 12),
                        Align(
                          alignment: Alignment.centerRight,
                          child: ElevatedButton(
                            onPressed: () => _apply(job['id'] as int),
                            child: const Text('Apply'),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
              separatorBuilder: (context, index) => const SizedBox(height: 12),
            ),
          );
        },
      ),
    );
  }
}
