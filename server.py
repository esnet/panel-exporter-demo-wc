import os
import posixpath
from urllib.parse import unquote
import http.server
import urllib.request
import urllib.error
# BaseHTTPServer
# from SimpleHTTPServer import SimpleHTTPRequestHandler
import json

GRAFANA_URL = "http://localhost:3000"
HOST = "127.0.0.1"
PORT = 5173
if os.environ.get("GRAFANA_URL"):
    GRAFANA_URL = os.environ.get("GRAFANA_URL")

# modify this to add additional routes
PROXY_ROUTES = [
    # [url_prefix]
    "/public",
    "/api",
    "/login",
    "/logout",
]

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.post_data = None
        super().__init__(*args, **kwargs)

    def send_proxy_response(self, resp):
        self.send_response(resp.getcode())
        headers = { k: v for k, v in resp.getheaders()}
        for header in resp.getheaders():
            self.send_header(*header)
        self.end_headers()
        self.copyfile(resp, self.wfile)

    def do_GET(self):
        for pattern in PROXY_ROUTES:
            if self.path.startswith(pattern):
                proxied_url = "%s%s" % (GRAFANA_URL, self.path)
                print("%s => %s" % (self.path, proxied_url))
                try:
                    headers = { k: v for k, v in self.headers.items()}
                    rqst = urllib.request.Request(proxied_url, data=self.post_data, headers=headers)
                    self.post_data = None
                    resp = urllib.request.urlopen(rqst)
                    self.send_proxy_response(resp)
                except urllib.error.HTTPError as resp:
                    self.send_proxy_response(resp)
                return
        super().do_GET()

    def do_POST(self, *args, **kwargs):
        length = self.headers['Content-Length']
        # set post_data. This will be passed to the proxy request
        self.post_data = self.rfile.read(int(length))
        self.do_GET(*args, **kwargs)

if __name__ == "__main__":
    server = http.server.HTTPServer((HOST, PORT), RequestHandler)
    print("Proxying requests on %s to %s (you can override with GRAFANA_URL environment variable)" % (",".join(PROXY_ROUTES), GRAFANA_URL))
    print("Serving HTTP on %s:%s" % (HOST, PORT))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    print("\nExiting on Interrupt")
    server.server_close()
