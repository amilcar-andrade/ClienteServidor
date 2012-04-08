//create table cursos (id varchar(255) ,matricula varchar(30), idioma varchar(30), nivel varchar(30), horario varchar(30));
net = require('net');
var sockets = [];
var borrar = "Borrar";
var crear = "Insertar";
var seleccionar = "Seleccionar";
var mensaje;
var mysql = require('db-mysql');
var fs = require("fs");
file = fs.openSync("bitacoraservidor.txt", "w+");


function Bitacora(txt) {
  txt = new Date() + " " + txt + "\r\n";
  fs.write(file, txt, null);
  console.log(txt);
}

var DB = new mysql.Database({
  hostname: 'localhost',
  user: 'root',
  database: 'test'
});

var conn;
DB.connect(function(error) {
  if (error) {
    Bitacora('ERROR CONEXION: ' + error);
  }
  conn = this;
});


function protComunicacion(msj, socket, listo) {
  socket1 = socket.remoteAddress;
  socket2 = socket.remotePort;

  direccion_port = "Direccion Cliente: " + socket1 + " Puerto Cliente: " + socket2;

  var ArrayMsj = msj.trim().split(',');
  if (ArrayMsj[0].toString() == borrar) {
    var sql2 = "DELETE FROM cursos WHERE (id = '" + ArrayMsj[1] + "')";
    Bitacora(direccion_port + sql2)
    conn.query(sql2).execute(function(error) {

      if (error) {
        Bitacora("ERROR: " + error);

      }
    });
    Bitacora(direccion_port +  "delete");
    listo("Tu registro ha sido borrado");


    return;
  }
  if (ArrayMsj[0].toString() == crear) {
    var id = parseInt(1000000 * Math.random());

    var sql = "INSERT INTO cursos VALUES ('" + id + "','" + ArrayMsj[1] + "','" + ArrayMsj[2] + "','" + ArrayMsj[3] + "','" + ArrayMsj[4] + "')";
    Bitacora(direccion_port + sql)
    conn.query(sql).execute(function(error) {

      if (error) {
        Bitacora("ERROR: " + error);

      }
    });
    Bitacora(direccion_port +  " insert");
    listo("Tu id del registro es  " + id);
    return;
  }
  if (ArrayMsj[0].toString() == seleccionar) {
    var sql3 = "SELECT * FROM cursos WHERE (id ='" + ArrayMsj[1] + "')";
    Bitacora(direccion_port + sql3);
    conn.query(sql3).execute(function(error, rows, cols) {

      if (error) {
        Bitacora("ERROR: " + error);
        return;
      }
      Bitacora(rows.length + " ROWS found");
      listo(JSON.stringify(rows));
    });
    Bitacora(direccion_port + " select");
    return;
  }
  listo("Comando Invalido");
  Bitacora(direccion_port + " comando invalido")

}


var s = net.Server(function(socket) {

  sockets.push(socket);


  socket.on('data', function(d) {

    for (var i = 0; i < sockets.length; i++) {
      if (socket != sockets[i]) {
        //sockets[i].write(d);
      }
    }


    mensaje = d.toString('utf8');//buffer es el d
    try {
      var id = protComunicacion(mensaje, socket, function(resultado) {
        socket.write(resultado + "\r\n");
      });
    } catch (e) {
      socket.write("mensaje invalido, error \r\n");
    }


  });


  socket.on('end', function() {

    var i = sockets.indexOf(socket);

    try {
      sockets.split(i, 1);


    } catch (e) {

      Bitacora("No más clientes accesando")
    }


  });


});


s.listen(process.argv[2]);


