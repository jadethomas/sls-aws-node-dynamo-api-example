const uuid = require('uuid');
const Joi = require('joi');
const dynamoDB = require('../dynamodb');

module.exports.handler = async (evt, ctx) => {
	const data = JSON.parse(evt.body);
	const timestamp = new Date().getTime();

	const schema = Joi.object().keys({
		accountNumberFormatted: Joi.string().required(),
		accountStatus: Joi.string().required(),
		customerNumber: Joi.number().greater(1000000),
		accountTypeCode: Joi.string().required(), 
		availableBalance: Joi.object().required(),
		currentBalance: Joi.object().required(),
		ledgerBalance: Joi.object().required(),
		nickname: Joi.string().required(),
		productCode: Joi.string().required(),
		productDescription: Joi.string().required(),
		productNumber: Joi.number().greater(1),
	});

	const { error, value } = Joi.validate(data, schema);
	console.log('validated');
	if (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error.details)
		};
	}
	console.log(process.env.ACCOUNTS_TABLE);
	const params = {
		TableName: process.env.ACCOUNTS_TABLE,
		Item: {
			id: uuid.v1(),
			accountNumberFormatted: data.accountNumberFormatted,
			accountStatus: data.accountStatus,
			accountTypeCode: data.accountTypeCode,
			availableBalance: data.availableBalance,
			currentBalance: data.currentBalance,
			customerNumber: data.customerNumber,
			ledgerBalance: data.ledgerBalance,
			nickname: data.nickname,
			productCode: data.productCode,
			productDescription: data.productDescription,
			productNumber: data.productNumber,
			createdAt: timestamp,
			updatedAt: timestamp
		}
	};
	try {
		await dynamoDB.put(params).promise();
		console.log('put');
		return {
			statusCode: 200,
			body: JSON.stringify(params.Item)
		};
	} catch (error) {
		console.log('errored');
		return {
			statusCode: 500,
			body: JSON.stringify(error)
		};
	}
};
