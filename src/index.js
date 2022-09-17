import { getBlogPosts } from "./data";
import "./style.css";
import HeroImage from "./asset/images/qq.jpg";

const blogs = getBlogPosts();

const ul = document.createElement("ul");
blogs.forEach(blog => { // 箭头函数作为forEach的回调函数,但在es6之前,是不支持箭头函数的,这样打包后应该转化成普通函数
  const li = document.createElement("li");
  li.innerHTML = blog;
  ul.appendChild(li);
});

document.body.appendChild(ul);

const image = document.createElement("img");
image.src = HeroImage;
document.body.prepend(image);

const h1 = document.createElement("h1");
h1.innerText = "blog list";
document.body.appendChild(h1);