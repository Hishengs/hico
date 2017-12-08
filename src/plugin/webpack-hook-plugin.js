function WebpackHookPlugin (hookname, callback){
	this.hookname = hookname || 'done';
	this.callback = callback || function(){};
}

WebpackHookPlugin.prototype.apply = function(compiler){
	const self = this;
	compiler.plugin(self.hookname, self.callback);
}

module.exports = WebpackHookPlugin;
