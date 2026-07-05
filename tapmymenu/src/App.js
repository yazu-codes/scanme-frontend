import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import DigitalMenu from "./DigitalMenu";

function MenuRoute() {
  const { urlname } = useParams();
  return <DigitalMenu urlname={urlname} />;
}
function CodeRoute() {
  const { code } = useParams();
  // do a call to localhost:8080/c/:code to get the urlname and then pass it to DigitalMenu.
  // Also change the url to /:urlname so that the user can bookmark it and share it with others. The code should be removed from the url.

  // TODO: Make a call to the backend to get the urlname from the code.
  
  let urlname = "";

  return <DigitalMenu urlname={urlname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/c/:code" element={<CodeRoute />} />
        <Route path="/:urlname" element={<MenuRoute />} />
      </Routes>
    </BrowserRouter>
  );
}