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
  title: "Articles",
  posts: postsTemplate.join(""),
  apple:"Apple",
  description:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis sed delectus quis quibusdam dolor suscipit. Facilis eveniet tenetur dolorum minus fugit, saepe voluptas voluptatum deleniti quia corporis tempore ex libero!",
};
