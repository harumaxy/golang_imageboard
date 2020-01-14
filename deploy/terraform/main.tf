// Provider

provider "google" {
  credentials = file("gcp_owner.json")
  project     = "thematic-bee-252602"
  region      = "asia-northeast1"
}

// Backend

terraform {
  backend "gcs" {
    bucket = "my-backend"
  }
}



// Network

resource "google_compute_network" "vpc" {
  name = "golang-imageboard"
}
resource "google_compute_subnetwork" "public_subnet" {
  name          = "public"
  ip_cidr_range = "10.10.0.0/16"
  network       = google_compute_network.vpc.name
  description   = "public api server"
  region        = "asia-northeast1"
}

// Kubernetes Cluster

resource "google_container_cluster" "primary" {
  name     = "my-gke-cluster"
  location = "asia-northeast1"

  remove_default_node_pool = true
  initial_node_count       = 1

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "my-node-pool"
  location   = "asia-northeast1"
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}


// Firewall

resource "google_compute_firewall" "firewall" {
  name    = "firewall"
  network = google_compute_network.vpc.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443"]
  }

  target_tags = ["${google_container_cluster.primary.name}"]

}

