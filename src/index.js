import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import User from "./controllers/User";
import Comics from "./controllers/Comics";
import Manga from "./controllers/Manga";
import "./css/main.css"
import News from "./controllers/News";
//Init controller for user data
const UserController = new User();
const ComicsController = new Comics();
const NewsController = new News();
const MangaController = new Manga();
try{
  window.speechSynthesis.cancel()
}catch (e){

}

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(<App UserController={UserController} NewsController={NewsController} MangaController={MangaController} ComicsController={ComicsController}/>, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
