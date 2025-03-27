async function getPosts() {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json(),
  );
}

const posts = await getPosts();

const postsTemplate = posts.map((post) => {
  return `
  <div>
    <h2>${post.title}</h2>
    <p>${post.body}</p>
  </div>
  `;
});

export default {
  title: "Posts",
};
