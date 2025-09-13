#!/usr/bin/env python3
import os
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/webhook":
            # Read payload
            content_length = int(self.headers.get("Content-Length", 0))
            payload = self.rfile.read(content_length)
            
            try:
                data = json.loads(payload.decode("utf-8"))
                # Only deploy on push to master
                if data.get("ref") == "refs/heads/master":
                    os.chdir("/opt/aquariangnosis")
                    
                    # 1. Git pull
                    subprocess.run(["git", "pull"], check=True)
                    
                    # 2. Install dependencies
                    subprocess.run(["./server/venv/bin/pip", "install", "-r", "./server/requirements.txt"])
                    os.chdir("client")
                    subprocess.run(["npm", "install"])
                    os.chdir("..")
                    
                    # 3. PM2 restart
                    subprocess.run(["pm2", "restart", "ecosystem.config.js"])
                    
                    self.send_response(200)
                    self.wfile.write(b"OK")
                    return
            except:
                pass
        
        self.send_response(404)
        self.wfile.write(b"Not Found")

if __name__ == "__main__":
    server = HTTPServer(("", 9000), WebhookHandler)
    print("Webhook server running on port 9000")
    server.serve_forever()
