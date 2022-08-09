"use strict";
// uuid library is a library to generate unique ids
const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const fetchTodos = async (event) => {
  /**
   * REMINDER, for this to work your AWS user for
   * serverless should get access to be able to
   * use the dynamoDb resource.
   */
  const dynamo = new AWS.DynamoDB.DocumentClient()
  let todos;

  try {
    const results = await dynamo.scan({ TableName: "TodoTable" }).promise();
    todos = results.Items;
  } catch (error) {
    console.log(error); 
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
  };
};

module.exports = {
  handler: fetchTodos,
};

