const postElement = document.getElementById("posts");
import { format } from "date-fns";

async function getPosts() {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json(),
  );
}

const posts = await getPosts();

const lists = posts.map((post) => {
  return `
  <div>
    <p>${post.title}</p>
    <p>${post.body}</p>
    <span>${format(new Date(), "yyyy-MM-dd")}</span>
  </div>
`;
});

postElement.innerHTML = lists.join("");
