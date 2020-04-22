const dynamoDB = require('../dynamodb');

module.exports.handler = async (evt, ctx) => {
	try {
		const results = await dynamoDB
			.scan({
				TableName: process.env.ACCOUNTS_TABLE
			})
			.promise();
		return {
			statusCode: 200,
			body: JSON.stringify(results)
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};
