const postElement = document.getElementById("posts");

async function getPosts() {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json(),
  );
}

const posts = await getPosts();

const lists = posts.map((post) => {
  return `
  <li>${post.title}</li>
`;
});

postElement.innerHTML = lists.join("");
