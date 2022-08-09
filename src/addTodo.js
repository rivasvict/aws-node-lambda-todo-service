"use strict";
// uuid library is a library to generate unique ids
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
/**
 * This middy Pachage helps to parse the body of the event
 * it is a middleware we will apply to the lamda function
 * when exporting it to avoid the usage of the JSON.parse
 * to obtain the body params from the event
 */
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');

const addTodo = ({ _AWS, _v4 }) => async (event) => {
  /**
   * REMINDER, for this to work your AWS user for
   * serverless should get access to be able to
   * use the dynamoDb resource.
   */
  const dynamo = new _AWS.DynamoDB.DocumentClient() // We need to create an instance of the dynamoDB

  /**
   * The event.body (where the body params
   * of the request live) is a string
   * instead of an object so we need to JSON
   * parse it.
   */
  const { todo } = event.body;
  const createdAt = new Date();
  // Generate a unique id
  const id = _v4();
  console.log('This is an id', id);

  const newTodo = {
    id,
    todo,
    createdAt,
    completed: false
  }

  await dynamo.put({
    TableName: "TodoTable",
    Item: newTodo
  }).promise(); // Promise is required to be returned

  return {
    statusCode: 200,
    body: JSON.stringify(newTodo),
  };
};

module.exports = {
  /**
   * This is how middy is used in order to automatically
   * parse the body with this middleware
   */
  handler: middy(addTodo({ _AWS: AWS, _v4: v4 })).use(httpJsonBodyParser()),
  addTodo
};
