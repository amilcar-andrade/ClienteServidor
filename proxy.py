import SocketServer
import SimpleHTTPServer
import urllib
import socket               # Import socket module



PORT = 80


class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        print self.path
        mensaje = self.path
        #modifico
        
        #modifico
        self.copyfile(urllib.urlopen('http://localhost:4567'+ self.path), self.wfile)
        
httpd = SocketServer.ForkingTCPServer(('', PORT), Proxy)
print "serving at port", PORT

httpd.serve_forever()

# no ha bloqueado proxyserver.com!
# GET  'http://facebook.com/home.html'
# host: proxyserver.com


# Esto nova a serveri!!!!
# GET '/home.html'
# host: facebook.com


