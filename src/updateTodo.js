"use strict";
const AWS = require("aws-sdk");

const updateTodo = async (event) => {
  /**
   * REMINDER, for this to work your AWS user for
   * serverless should get access to be able to
   * use the dynamoDb resource.
   */
  const dynamo = new AWS.DynamoDB.DocumentClient() // We need to create an instance of the dynamoDB

  /**
   * The event.body (where the body params
   * of the request live) is a string
   * instead of an object so we need to JSON
   * parse it.
   */
  const { completed } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  await dynamo.update({
    TableName: "TodoTable",
    Key: { id },
    /**
     * This is the expression that will update the
     * desired attribute (in this case, completed)
     */
    UpdateExpression: 'set completed = :completed',
    /**
     * ExpressionAttributeValues is used to inject the
     * value after the semi-colon on the UpdateExpression
     * attribute
     */
    ExpressionAttributeValues: {
      /**
       * Now we inject our completed value into the
       * UpdateExpression completed variable
       */
      ":completed": completed
    },
    ReturnValues: "ALL_NEW"
  }).promise(); // Promise is required to be returned

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Updated todo"
    }),
  };
};

module.exports = {
  handler: updateTodo,
};

