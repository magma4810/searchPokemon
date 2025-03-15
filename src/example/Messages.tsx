import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreApp } from "./store";
import { addMessages, deleteMessage } from "./store/messages.slice";

export const Messages: FC = () => {
  const messages = useSelector((store: StoreApp) => store.messages);
  const dispatch = useDispatch();

  const [massage, setMessage] = useState("");

  const handleAddMessage = () => {
    dispatch(
      addMessages({
        id: messages[messages.length - 1].id + 1,
        author: "me",
        value: massage,
        createdAt: new Date().toISOString(),
      }),
    );
    setMessage("");
  };

  return (
    <>
      <div className=" flex items-center justify-center flex-col">
        <div>
          <input
            type="text"
            value={massage}
            onChange={(ev) => setMessage(ev.target.value)}
            className=" w-[20vw] bg-slate-500"
          />
          <button className=" bg-lime-500" onClick={handleAddMessage}>
            Send
          </button>
        </div>
        <ul>
          {messages.map(({ id, author, value, createdAt }) => {
            const date = new Date(createdAt);
            return (
              <li key={id} className=" flex justify-evenly w-[20vw]">
                <div>
                  {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}{" "}
                </div>
                {author}:{value}
                <button
                  className=" bg-slate-500"
                  onClick={() => dispatch(deleteMessage(id))}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
