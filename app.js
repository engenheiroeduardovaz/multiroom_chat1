/* importar as config do servidor */
var app = require('./config/server');

/*parametrizar a porta de escuta */
var server = app.listen(80, function(){
	console.log('Servidor online');
});

var io = require('socket.io').listen(server);
app.set('io', io);

/* criar a conexão por webscoket */
io.on('connection', function(socket){
	console.log('Usuario conectou');

	socket.on('disconnect', function(){
		console.log('Usuario desconectou');
	});

	socket.on('msgParaServidor', function(data){
		
		/* dialogo */ 
		socket.emit(
			'msgParaCliente',
			{apelido: data.apelido, mensagem: data.mensagem}
		);

		socket.broadcast.emit(
			'msgParaCliente',
			{apelido: data.apelido, mensagem: data.mensagem}
		);

		/* atualizando a relação de participantes */
		if(parseInt(data.apelido_atualizado_nos_clientes) == 0){
			socket.emit(
				'participantesParaCliente',
				{apelido: data.apelido}
		);

			socket.broadcast.emit(
				'participantesParaCliente',
				{apelido: data.apelido}
			);
		}
	});

});