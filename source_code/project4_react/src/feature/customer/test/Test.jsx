import React, { useEffect, useState } from "react";

import { ref, set, onValue, off } from "firebase/database";
import database from "@/shared/api/firebaseApi";

export default function Test() {
  const [count, setCount] = useState(1);

  const writeData = (userId, name, email) => {
    set(ref(database, "users/" + userId), {
      username: name,
      email: email,
    });
  };

  const readData = () => {
    const userRef = ref(database, "users/");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  };

  useEffect(() => {
    const userRef = ref(database, "users/");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Real-time Data:", data);
      setCount((prev) => prev + 1);
    });

    return () => {
      off(userRef);
    };
  }, []);

  const handleAddUser = () => {
    writeData("1", "John Doe", "john.doe@example.com");
  };

  return (
    <div>
      {count}
      <h1>Firebase Realtime Database</h1>
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}
