import SocketServer
import SimpleHTTPServer
import urllib
import datetime
PORT = 80
class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        print self.path
        a = self.path
        # a = '/'
        registro = a.split('?')[0]
        # regsitro = '/'
        bitacoraProxy  = open('bitacoraProxy.txt', 'a')
        channel = urllib.urlopen('http://localhost:4567'+ self.path)
        cuerpo = channel.read()
        
        if registro == '/registro':
            peticion = a.split('&')
            m = peticion[0].split('=')
            i = peticion[1].split('=')
            n = peticion[2].split('=')
            h = peticion[3].split('=')
            textoid = 'Tu id del registro es  '
            index = cuerpo.find(textoid) + len(textoid)
            
            if m[1] == "A01163951":
                Sin_Registro = '/registro?matricula=A01163951&idioma=&nivel=&horario='
                channel = urllib.urlopen('http://localhost:4567'+ Sin_Registro)
                cuerpo = channel.read()
                self.wfile.write(cuerpo)
                #hacer mas cosas
                register = "Fecha: " + str(datetime.date.today())+ " HORARIO ORIGINAL: Alumno " + m[1] + " se registro en "+ i[1]+ " " +n[1]+ " en el horario de las " +h[1]+"am" + " , ID unica = " + cuerpo[index:index+7] + "\r\n"
                bitacoraProxy.write(register)
                register = "Fecha: " + str(datetime.date.today())+ " HORARIO CAMBIADO: Alumno " + "' '" + " se registro en " + "' '" + " " + "' '" + " en el horario de las " +"' '" +"am" + " , ID unica = " + cuerpo[index:index+7] + "\r\n"
                bitacoraProxy.write(register)
                bitacoraProxy.close()
                self.wfile.write(cuerpo)

                
            else:  
                register = "Fecha: " + str(datetime.date.today())+ " Alumno " + m[1] + " se registro en " + i[1]+ " " +n[1]+ " en el horario de las " +h[1]+"am" + " , ID unica = " + cuerpo[index:index+7] + "\r\n"
                bitacoraProxy.write(register)
                bitacoraProxy.close()
                self.wfile.write(cuerpo)       
        else:
            self.wfile.write(cuerpo)
            #self.copyfile(cuerpo, self.wfile)
        
httpd = SocketServer.ForkingTCPServer(('', PORT), Proxy)
print "serving at port", PORT

httpd.serve_forever()

# no ha bloqueado proxyserver.com!
# GET  'http://facebook.com/home.html'
# host: proxyserver.com


# Esto nova a serveri!!!!
# GET '/home.html'
# host: facebook.com


