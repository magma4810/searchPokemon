import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreApp } from "./store";
import { changeName } from "./store/profile.slice";

export const Profile: FC = () => {
  const nameStore = useSelector((store: StoreApp) => store.profile.name);
  const age = useSelector((store: StoreApp) => store.profile.age);
  const visiable = useSelector((store: StoreApp) => store.profile.visiable);
  const dispatch = useDispatch();

  const handleChangeName = () => {
    dispatch(changeName(name));
    setName("");
  };

  const [name, setName] = useState("");

  return (
    <>
      <p>age: {age}</p>
      <p>name: {nameStore}</p>
      <input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
        className=" bg-sky-700"
      />
      <button onClick={handleChangeName} className=" bg-sky-900">
        change
      </button>
      <p>visiable: {visiable.toString()}</p>
    </>
  );
};
