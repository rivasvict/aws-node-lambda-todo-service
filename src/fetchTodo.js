"use strict";
const AWS = require("aws-sdk");

const fetchTodo = async (event) => {
  const { id } = event.pathParameters;
  const dynamo = new AWS.DynamoDB.DocumentClient()
  let todo;

  try {
    const result = await dynamo.scan({
      TableName: "TodoTable",
      Key: id
    }).promise(); // promise is required to be returned
    todo = result.Item;
  } catch (error) {
    console.log(error); 
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  };
};

module.exports = {
  handler: fetchTodo,
};

