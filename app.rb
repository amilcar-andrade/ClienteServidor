# encoding: utf-8
require "rubygems"
require "bundler/setup"
require "sinatra"
require "iconv"
require 'socket'


s = nil

get '/conectar' do
  host =params[:host]
  port =params[:port]
  s = TCPSocket.open host, port
  erb :layout
end


get '/registro' do
  s.puts "Insertar,#{params[:matricula]},#{params[:idioma]},#{params[:nivel]},#{params[:horario]}"
  @estado = "success"
    @result = s.gets

  erb :layout

end

get '/buscar' do
  s.puts "Seleccionar,#{params[:id]}"
  @result = s.gets
  @estado = "success"

  erb :layout
end


get '/baja' do
  s.puts "Borrar,#{params[:id]}"
  @result = s.gets
  @estado = "success"
  erb :layout
end


get '/' do
  erb :layout
end


