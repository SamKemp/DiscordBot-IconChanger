module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('Logged in as ' + client.user.tag + '!');

		client.tables.get('icons').sync();
		client.tables.get('banners').sync();
	},
};