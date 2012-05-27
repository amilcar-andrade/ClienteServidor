# encoding: utf-8
require "rubygems"
require "bundler/setup"
require "sinatra"
require 'socket'


s = nil
ARCHIVO = File.open('bitacora.txt', 'w')


def bitacora(txt)
  txt = Time.now().to_s + " " + txt
  puts txt
  ARCHIVO.puts txt
  ARCHIVO.flush
end

bitacora "Inicio bitacora #{Time.now}"


get'/conectar' do
  host =params[:host]
  port =params[:port]
  s = TCPSocket.open host, port
  bitacora(params[:host] + params[:port])
  erb :layout
end


get '/registro' do
  mensaje = "Insertar,#{params[:matricula]},#{params[:idioma]},#{params[:nivel]},#{params[:horario]}"
  s.puts mensaje
  @estado = "success"

  bitacora("mensaje enviado: " + mensaje)
  mensaje_recibido = @result = s.gets
  bitacora("respuesta recibida: " + mensaje_recibido)
  erb :layout

end

get '/buscar' do
  mensaje = "Seleccionar,#{params[:id]}"
  s.puts mensaje
  bitacora("mensaje enviado: " + mensaje)

  mensaje_recibido = @result = s.gets
  bitacora("respuesta recibida: " + mensaje_recibido)

  @estado = "success"

  erb :layout
end


get '/baja' do
  mensaje = "Borrar,#{params[:id]}"
  bitacora("mensaje enviado: " + mensaje)

  s.puts mensaje

  mensaje_recibido = @result = s.gets
  bitacora("respuesta recibida: " + mensaje_recibido)

  @estado = "success"
  erb :layout
end



get '/' do
  erb :layout
end


