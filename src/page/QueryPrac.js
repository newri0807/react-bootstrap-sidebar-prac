import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import fetchPosts from "../hooks/FetchApi";
import Form from "../component/Form";
import axios from "axios";

const QueryPrac = () => {
  const queryClient = useQueryClient();

  const { isLoading, isError, data: todos } = useQuery("todos", fetchPosts);

  const addTodoMutation = useMutation(
    (newTodo) => {
      return axios.post("https://jsonplaceholder.typicode.com/todos", newTodo);
    },
    {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries("todos");

        const previousTodos = queryClient.getQueryData("todos");

        queryClient.setQueryData("todos", (old) => [...(old || []), newTodo]);

        return { previousTodos };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData("todos", context.previousTodos);
      },
      onSettled: (data, error, newTodo, context) => {
        console.log("Todos:", queryClient.getQueryData("todos"));
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const handleAddTodo = (newTodo) => {
    addTodoMutation.mutate({
      userId: 1,
      id: Math.random(),
      title: newTodo.title,
      completed: false,
    });
  };

  return (
    <div className="right_container">
      {isLoading ? (
        "Loading todos..."
      ) : isError ? (
        <div>An error occurred while fetching the todos.</div>
      ) : (
        <>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>

          {addTodoMutation.isLoading ? (
            "Adding todo..."
          ) : (
            <>
              {addTodoMutation.isError ? (
                <div>An error occurred: {addTodoMutation.error.message}</div>
              ) : null}

              {addTodoMutation.isSuccess ? <div>Todo added!</div> : null}

              <Form onSubmit={handleAddTodo} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QueryPrac;
