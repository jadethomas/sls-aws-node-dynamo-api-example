const dynamoDB = require('../dynamodb');

module.exports.handler = async (evt, ctx) => {
	const id = evt.pathParameters.id;
	try {
		await dynamoDB
			.delete({
				TableName: process.env.ACCOUNTS_TABLE,
				Key: {
					id
				}
			})
			.promise();
		return {
			statusCode: 200,
			body: JSON.stringify({ msg: `Job has deleted with id ${id}` })
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};
