"use strict";
// uuid library is a library to generate unique ids
const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const fetchTodo = async (event) => {
  /**
   * REMINDER, for this to work your AWS user for
   * serverless should get access to be able to
   * use the dynamoDb resource.
   */
  const dynamo = new AWS.DynamoDB.DocumentClient()

  /**
   * The event.body (where the body params
   * of the request live) is a string
   * instead of an object so we need to JSON
   * parse it.
   */
  const { todo } = JSON.parse(event.body);
  const createdAt = new Date();
  // Generate a unique id
  const id = v4();
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
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newTodo),
  };
};

module.exports = {
  handler: fetchTodo,
};

