import axios from "axios";

async function fetchPosts() {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  console.log(data);

  return data.slice(0, 10); // 0부터 9까지의 항목 반환
}

export default fetchPosts;
