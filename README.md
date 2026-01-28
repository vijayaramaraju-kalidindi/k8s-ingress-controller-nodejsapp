# k8s-ingress-controller-nodejsapp
Node JS App Deployed on K3S setup

A modern Node.js application deployed on a **k3s Kubernetes cluster**, exposed using **Traefik IngressRoute**, and designed to visually demonstrate **load balancing, pod identity, and runtime metadata** through a sleek UI.

# This project is ideal for:
- Kubernetes ingress demos
- Traefik IngressRoute learning
- Interviews and architecture walkthroughs
- Internal team knowledge sharing

## ✨ Features

- Sleek, modern UI (glassmorphism style)
- Shows real Kubernetes runtime details
- Demonstrates load balancing across pods
- Native Traefik IngressRoute integration
- No frontend frameworks, lightweight and fast

## Information displayed on UI
- Pod hostname
- Pod IP
- Node name
- Namespace
- Node.js version
- Platform
- Environment
- Pod uptime
- Request count per pod
- Client IP
- Current server time

Refreshing the page shows different pod hostnames, clearly proving load balancing.

---

## 📂 Repository Structure
```text
.
├── public/
│ └── index.html # UI
├── Dockerfile # Container image definition
├── package.json # Node.js dependencies
├── server.js # Backend application
├── README.md # Documentation
```text

## 🧱 Prerequisites

- k3s cluster (1 master + 1 worker or more)
- Traefik installed (default in k3s)
- Docker or Podman
- kubectl configured
- Access to a container registry (Docker Hub or private registry)

---

## 🚀 Build and Push Docker Image

Clone the repository:

git clone https://github.com/vijayaramaraju-kalidindi/k8s-ingress-controller-nodejsapp.git
cd k8s-ingress-controller-nodejsapp

Build the image:

docker build -t <your-dockerhub-username>/k8s-ui-demo:1.0 .

Push the image:

docker push <your-dockerhub-username>/k8s-ui-demo:1.0

☸️ Kubernetes Deployment
1️⃣ Deployment

Creates 3 replicas and injects Kubernetes metadata using the Downward API.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-ui-demo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: k8s-ui-demo
  template:
    metadata:
      labels:
        app: k8s-ui-demo
    spec:
      containers:
      - name: k8s-ui-demo
        image: <your-dockerhub-username>/k8s-ui-demo:1.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace

Apply:

kubectl apply -f deployment.yaml

2️⃣ Service

ClusterIP service used by Traefik.

apiVersion: v1
kind: Service
metadata:
  name: k8s-ui-demo
spec:
  type: ClusterIP
  selector:
    app: k8s-ui-demo
  ports:
  - port: 80
    targetPort: 3000


Apply:

kubectl apply -f service.yaml

🌐 Traefik IngressRoute

This IngressRoute allows direct IP-based access, no DNS or /etc/hosts required.

apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: k8s-ui-demo
spec:
  entryPoints:
  - web
  routes:
  - match: PathPrefix(`/`)
    kind: Rule
    services:
    - name: k8s-ui-demo
      port: 80

Apply:

kubectl apply -f ingressroute.yaml

🔍 Verification

Check resources:

kubectl get pods
kubectl get svc k8s-ui-demo
kubectl get ingressroute
kubectl get endpoints k8s-ui-demo

You should see:

Multiple running pods

ClusterIP service

One IngressRoute

Multiple endpoints

🌍 Access the Application

Get Traefik external IPs:

kubectl get svc -n kube-system

Example output:

traefik   LoadBalancer   10.32.x.x,10.32.x.x

Open in browser:

http://10.32.x.x

Refresh multiple times to observe:

Hostname changes

Request counter resets per pod

This visually confirms load balancing.
