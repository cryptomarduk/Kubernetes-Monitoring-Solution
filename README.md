# Kubernetes-Monitoring-Solution

This project creates a comprehensive monitoring solution for Kubernetes using Prometheus and Grafana. It includes application monitoring with custom metrics and an alerting system with AlertManager.

## Project Contents

This project includes the following components:

1. **Prometheus**: Time series database and data collection tool
   - Collects metrics from Kubernetes resources and applications
   - Sends alerts to AlertManager for basic and custom metrics

2. **Grafana**: Visualization and dashboard tool
   - Visualizes cluster and application metrics with pre-configured dashboards
   - Customizable panels and graphs

3. **AlertManager**: Alert and notification manager
   - Sends notifications via Slack, email, or other channels
   - Alert grouping and silencing features

4. **Demo Application**: Sample Node.js application exposing Prometheus metrics
   - Custom metrics like HTTP request count, response time
   - Simulated production environment data

## Prerequisites

- A running Kubernetes cluster (Minikube, EKS, GKE, AKS, etc.)
- kubectl installed and configured
- Docker (for building application images)

## Setup Steps

### 1. Create Monitoring Namespace

```bash
kubectl apply -f kubernetes/namespace.yaml
```

### 2. Build and Push Demo Application

```bash
# Navigate to app directory
cd app

# Build Docker image
docker build -t <dockerhub-username>/monitoring-demo-app:latest .

# Push to Docker Hub
docker push <dockerhub-username>/monitoring-demo-app:latest

# Edit the deployment file
sed -i 's|${YOUR_DOCKERHUB_USERNAME}|<dockerhub-username>|g' kubernetes/sample-app/app-deployment.yaml
```

### 3. Deploy Components in Sequence

```bash
# Deploy Prometheus
kubectl apply -f kubernetes/prometheus/

# Deploy AlertManager
kubectl apply -f kubernetes/alertmanager/

# Deploy Grafana
kubectl apply -f kubernetes/grafana/

# Deploy Demo application
kubectl apply -f kubernetes/sample-app/
```

### 4. Make Components Accessible

```bash
# Port-forward Prometheus UI
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Port-forward Grafana UI
kubectl port-forward -n monitoring svc/grafana 3000:3000

# Port-forward AlertManager UI
kubectl port-forward -n monitoring svc/alertmanager 9093:9093

# Port-forward Demo application
kubectl port-forward -n monitoring svc/monitoring-demo-app 8080:80
```

## Access Information

- **Prometheus UI**: http://localhost:9090
  - Run metric queries and visualize
  - View targets and alerts

- **Grafana**: http://localhost:3000
  - Username: admin
  - Password: admin123
  - View pre-configured dashboards

- **AlertManager**: http://localhost:9093
  - View and manage active alerts

- **Demo Application**: http://localhost:8080
  - Metrics: http://localhost:8080/metrics

## Dashboards

This setup includes the following pre-configured dashboards:

1. **Node Metrics**: CPU, memory, and disk usage of Kubernetes nodes
2. **Application Metrics**: Request rate, response time, and error rate of the demo application

## Alerts and Notifications

### Available Alerts

1. **InstanceDown**: When an instance is unreachable for more than 1 minute
2. **HighCPUUsage**: When CPU usage is above 80% for more than 5 minutes
3. **HighMemoryUsage**: When memory usage is above 80% for more than 5 minutes
4. **HighErrorRate**: When error rate is above 5% for more than 2 minutes
5. **SlowResponseTime**: When 95th percentile response time is above 1 second for more than 5 minutes

### Configuring Notification Channels

To configure Slack notifications:

1. Create a webhook URL in Slack
2. Edit the `kubernetes/alertmanager/alertmanager-config.yaml` file
3. Replace the `api_url` value with your Slack webhook URL
4. Reapply the AlertManager configuration

```bash
kubectl apply -f kubernetes/alertmanager/alertmanager-config.yaml
```

## Adding Custom Metrics

The demo application provides the following custom metrics:

- `http_requests_total`: Total number of HTTP requests (labeled by method, endpoint, status)
- `http_request_duration_seconds`: Duration of HTTP requests in seconds
- `random_value`: Simulated random value (Gauge metric)

To add metrics for your own application:

1. Use the Prometheus client library (language-dependent)
2. Define and register your metrics
3. Provide a `/metrics` endpoint
4. Add Prometheus annotations to your Kubernetes deployment

## Troubleshooting

### Checking Prometheus Targets

```bash
# Check in Prometheus UI under Status > Targets
# Or check via API
curl http://localhost:9090/api/v1/targets | jq
```

### Checking Pod Logs

```bash
# Prometheus logs
kubectl logs -n monitoring -l app=prometheus

# Grafana logs
kubectl logs -n monitoring -l app=grafana

# AlertManager logs
kubectl logs -n monitoring -l app=alertmanager

# Demo application logs
kubectl logs -n monitoring -l app=monitoring-demo-app
```

### Common Issues

- **Targets in DOWN state**: Check service/pod labels and Prometheus configuration
- **Metrics not appearing**: Check endpoint accessibility and format
- **Alerts not being sent**: Check AlertManager configuration and notification channel access

## Architecture Explanation

This monitoring solution works as follows:

1. **Metric Collection**: Prometheus scrapes metrics from configured targets at regular intervals
2. **Data Storage**: Collected metrics are stored in Prometheus' time series database
3. **Alert Evaluation**: Prometheus regularly evaluates metric data against alert rules
4. **Notification Sending**: Triggered alerts are sent to AlertManager and forwarded to notification channels
5. **Visualization**: Grafana pulls data from Prometheus and creates visual dashboards

## Future Steps and Improvements

Suggestions to enhance this solution:

1. Add persistent storage (PersistentVolume) for Prometheus
2. Set up a CI/CD pipeline for Grafana dashboards
3. Add more notification channels (PagerDuty, OpsGenie, etc.)
4. Collect more detailed Kubernetes metrics with kube-state-metrics
5. Add service mesh (Istio, Linkerd) integration for more detailed service metrics
6. Use Prometheus Operator for more advanced monitoring configuration

## Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
