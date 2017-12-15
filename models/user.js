module.exports = function(sequilize, DataTypes){
	var user = sequilize.define("User", {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
		name: DataTypes.STRING
	});

	return user;
}