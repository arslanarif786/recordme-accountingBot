import { io } from "socket.io-client";
import store from "../../app/store/index";


const socket = io(process.env.SOCKET_URL);

// socket.on("connect_error", (err) => {
//     console.log(err.message); // prints the message associated with the error
// });
export default socket;
