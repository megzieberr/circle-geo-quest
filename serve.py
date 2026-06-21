#!/usr/bin/env python3
"""Static dev server with caching disabled.

Python's stock `http.server` sends no cache headers, so browsers hold on to
ES modules across reloads and source edits don't show up. This sends
no-store on every response so the preview always reflects the latest files.
Usage: python serve.py [port]   (default 5180)
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
