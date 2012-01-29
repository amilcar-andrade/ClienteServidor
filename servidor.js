//create table cursos (id varchar(255) ,matricula varchar(30), idioma varchar(30), nivel varchar(30), horario varchar(30));

net = require('net');
var sockets = [];
var borrar = "Borrar";
var crear = "Insertar";
var seleccionar = "Seleccionar";
var updatear = "Update";
var mensaje;
var mysql = require('db-mysql');

var DB = new mysql.Database({
  hostname: 'localhost',
  user: 'root',
  database: 'test'
});

var conn;
DB.connect(function(error) {
  if (error) {
    console.log('ERROR CONEXION: ' + error);
  }
  conn = this;
});


function protComunicacion(msj, listo) {

  var ArrayMsj = msj.trim().split(',');
  if (ArrayMsj[0].toString() == borrar) {
    var sql2 = "DELETE FROM curso WHERE (id = '" + ArrayMsj[1] + "')";
    console.log(sql2)
    conn.query(sql2).execute(function(error) {

      if (error) {
        console.log("ERROR: " + error);
      }
    });
    console.log("delete");
    listo("Tu registro ha sido borrado");
    return;
  }
  if (ArrayMsj[0].toString() == crear) {
    var id = parseInt(1000000 * Math.random());

    var sql = "INSERT INTO curso VALUES ('" + id + "','" + ArrayMsj[1] + "','" + ArrayMsj[2] + "','" + ArrayMsj[3] + "','" + ArrayMsj[4] + "')";
    console.log(sql)
    conn.query(sql).execute(function(error) {

      if (error) {
        console.log("ERROR: " + error);

      }
    });
    console.log("insert");
    listo("Tu id del registro es  " + id);
    return;
  }
  if (ArrayMsj[0].toString() == seleccionar) {
    var sql3 = "SELECT * FROM curso WHERE (id ='" + ArrayMsj[1]+"')";
    console.log(sql3);
    conn.query(sql3).execute(function(error, rows, cols) {

      if (error) {
        console.log("ERROR: " + error);
        return;
      }
      console.log(rows.length + " ROWS found");
      listo(JSON.stringify(rows));
    });
    console.log("select");
    return;
  }
  listo("error");
  console.log("error")

}


var s = net.Server(function(socket) {

  sockets.push(socket);


  socket.on('data', function(d) {

    for (var i = 0; i < sockets.length; i++) {
      if (socket != sockets[i]) {
        sockets[i].write(d);
      }
    }

    mensaje = d.toString('utf8');//buffer es el d
    try {
      var id = protComunicacion(mensaje, function(resultado) {
        socket.write(resultado + "\r\n");
      });
    } catch (e) {
      socket.write("mensaje invalido, error\r\n");
    }

  });


  socket.on('end', function() {

    var i = sockets.indexOf(socket);

    sockets.split(i, 1);


  });


});


s.listen(process.argv[2]);


