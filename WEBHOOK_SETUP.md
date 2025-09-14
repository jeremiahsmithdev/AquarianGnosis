# GitHub Webhook Setup for Automatic Deployment

This document covers the complete process for setting up GitHub webhooks for automatic deployment, based on real experience with Oracle Cloud infrastructure.

## Overview

The webhook system provides automatic deployment when code is pushed to the master branch:
1. Developer pushes to master
2. GitHub sends webhook to server
3. Server pulls latest code, installs dependencies, restarts services

## Common Issues & Solutions

### Issue 1: Cloud Provider Security Groups Block Webhook Ports
**Problem**: GitHub webhook fails with 502 errors even when OS firewall is configured correctly.

**Root Cause**: Cloud providers (Oracle Cloud, AWS, etc.) have additional network security layers beyond the OS firewall.

**Solution**: Use Nginx reverse proxy to route webhooks through standard HTTP ports (80/443) that are already open.

### Issue 2: Repository Access Permissions
**Problem**: `gh` CLI returns 404 errors when trying to create webhooks.

**Root Cause**: Wrong repository name or insufficient permissions.

**Solution**: Always verify the exact repository name using `git remote -v` before creating webhooks.

## Prerequisites

1. **Server Requirements**:
   - Nginx installed and running
   - PM2 for process management
   - Git repository cloned to server
   - Python virtual environment set up

2. **Access Requirements**:
   - SSH access to production server
   - GitHub CLI (`gh`) authenticated with webhook permissions
   - Repository push access

## Step-by-Step Setup

### 1. Create Webhook Handler Script

Create a simple webhook handler on your server:

```bash
# SSH to your server
ssh user@your-server-ip

# Create webhook script
sudo tee /opt/your-project/webhook.py << 'EOF'
#!/usr/bin/env python3
import json
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/webhook":
            try:
                # Read the payload
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))

                # Only deploy on push to master
                if data.get("ref") == "refs/heads/master":
                    print(f"Deploying from commit: {data.get('after', 'unknown')}")

                    # Change to project directory
                    os.chdir("/opt/your-project")

                    # Pull latest code
                    subprocess.run(["git", "pull"], check=True)

                    # Install backend dependencies
                    subprocess.run([
                        "./server/venv/bin/pip", "install", "-r",
                        "./server/requirements.txt"
                    ], check=True)

                    # Install frontend dependencies
                    subprocess.run(["npm", "ci"], cwd="./client", check=True)

                    # Restart PM2 services
                    subprocess.run(["pm2", "restart", "ecosystem.config.js"], check=True)

                    print("Deployment completed successfully")

                # Always return 200 to GitHub
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'OK')

            except Exception as e:
                print(f"Webhook error: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error: {e}'.encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(('localhost', 9000), WebhookHandler)
    print("Webhook server starting on port 9000...")
    server.serve_forever()
EOF

# Make it executable
chmod +x /opt/your-project/webhook.py
```

### 2. Create Systemd Service

Create a systemd service to manage the webhook:

```bash
sudo tee /etc/systemd/system/webhook.service << 'EOF'
[Unit]
Description=GitHub Webhook Handler
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/opt/your-project
ExecStart=/usr/bin/python3 /opt/your-project/webhook.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable webhook
sudo systemctl start webhook
sudo systemctl status webhook
```

### 3. Configure Nginx Reverse Proxy

This is the **critical step** that solves cloud provider firewall issues:

```bash
sudo tee /etc/nginx/conf.d/webhook.conf << 'EOF'
server {
    listen 80;
    server_name your-server-ip;

    location /webhook {
        proxy_pass http://localhost:9000/webhook;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. Test Local Connectivity

Before creating the GitHub webhook, test that everything works locally:

```bash
# Test webhook service directly (should return 501 for HEAD request)
curl -I http://localhost:9000/webhook

# Test through Nginx proxy (should also return 501 for HEAD request)
curl -I http://your-server-ip/webhook
```

**Expected Response**: `HTTP/1.1 501 Unsupported method ('HEAD')` - This is correct! The webhook only accepts POST requests.

### 5. Create GitHub Webhook

**CRITICAL**: Always verify your repository name first:

```bash
# In your local project directory
git remote -v
# Example output: origin https://github.com/username/repository.git

# Create the webhook using the EXACT repository name from above
gh api repos/username/repository/hooks --method POST \
  --field name=web \
  --field active=true \
  --field 'config[url]=http://your-server-ip/webhook' \
  --field 'config[content_type]=json' \
  --field 'events[]=push'
```

### 6. Test the Complete Workflow

```bash
# Make a test change
echo "# Webhook Test $(date)" >> README.md
git add README.md
git commit -m "test: webhook deployment test"
git push

# Check server logs to verify webhook triggered
ssh user@your-server-ip "sudo journalctl -u webhook --since '1 minute ago' --no-pager"
```

## Troubleshooting

### Webhook Returns 502 Error

**Problem**: GitHub shows 502 Bad Gateway when trying to deliver webhook.

**Diagnosis**:
```bash
# Test external connectivity
curl -I http://your-server-ip/webhook

# If this times out, the issue is cloud provider security groups
```

**Solution**: The Nginx reverse proxy approach in step 3 solves this.

### Webhook Returns 404 Error

**Problem**: GitHub API returns 404 when creating webhook.

**Common Causes**:
- Wrong repository name (check with `git remote -v`)
- Insufficient permissions (need admin access to repository)
- Repository doesn't exist or is private without proper access

### Deployment Fails Silently

**Problem**: Webhook receives request but deployment doesn't happen.

**Diagnosis**:
```bash
# Check webhook service logs
sudo journalctl -u webhook -f

# Check if services are running
pm2 list

# Test git pull manually
cd /opt/your-project && git pull
```

### Permission Issues During Deployment

**Problem**: Git pull or PM2 restart fails due to permissions.

**Solution**:
```bash
# Ensure webhook service runs as correct user
sudo systemctl edit webhook

# Add these lines:
[Service]
User=your-username
Group=your-group

# Restart service
sudo systemctl daemon-reload
sudo systemctl restart webhook
```

## Security Considerations

1. **Webhook Secret**: Consider adding GitHub webhook secret validation:
```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

2. **Firewall**: Only webhook port 9000 needs to be accessible locally, not externally.

3. **User Permissions**: Webhook service should run as a user with minimal necessary permissions.

## Monitoring

Set up monitoring to catch deployment failures:

```bash
# Add to webhook handler for Slack/email notifications
def notify_deployment_status(success, error=None):
    # Implementation for your notification system
    pass
```

## Files Created

After setup, you should have these files:
- `/opt/your-project/webhook.py` - Webhook handler script
- `/etc/systemd/system/webhook.service` - Systemd service
- `/etc/nginx/conf.d/webhook.conf` - Nginx proxy configuration

## Common Gotchas

1. **Always use Nginx proxy** - Don't try to expose webhook ports directly
2. **Verify repository name** - Use `git remote -v` to get exact name
3. **Test locally first** - Ensure webhook responds before creating GitHub webhook
4. **Check cloud security groups** - OS firewall isn't enough
5. **Use systemd for reliability** - Don't run webhook script manually

## Summary

The key insight is that cloud providers block custom ports by default. Using Nginx as a reverse proxy through standard HTTP ports (80/443) bypasses this limitation and provides a reliable webhook setup that works across different cloud providers.