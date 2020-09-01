const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const twitsElement = document.querySelector(".twits");

const API_URI = "http://localhost:4000/add";

loadingElement.style.display = "";
listAllTwits();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");
  const newTwit = {
    name,
    content,
  };
  loadingElement.style.display = "";
  form.style.display = "none";

  fetch(API_URI, {
    method: "post",
    body: JSON.stringify(newTwit),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((cretedNew) => {
      console.log(cretedNew);
      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 30000);
      listAllTwits();
    });
});

function listAllTwits() {
  twitsElement.innerHTML = "";
  fetch(API_URI)
    .then((response) => response.json())
    .then((twits) => {
      twits.reverse();
      twits.forEach((twit) => {
        const div = document.createElement("div");
        const header = document.createElement("h3");
        header.textContent = twit.name;
        const contents = document.createElement("p");
        contents.textContent = twit.content;
        const date = document.createElement("small");
        date.textContent = new Date(twit.created);
        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);
        twitsElement.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}
