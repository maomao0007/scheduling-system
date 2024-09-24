import React from "react";

import ReactDOM from "react-dom";

import Chat from "./Chat";

window.initChat = function (containerId, currentUserId, isAdmin, users) {
  const container = document.getElementById(containerId);

  ReactDOM.render(
    <Chat currentUserId={currentUserId} isAdmin={isAdmin} users={users} />,

    container
  );
};
