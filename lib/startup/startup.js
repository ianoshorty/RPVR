if (Meteor.isServer) {
	publicConfig = JSON.parse(Assets.getText("config/public_config.json"));
}