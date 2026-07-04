import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import DigitalMenu from "./DigitalMenu";

function MenuRoute() {
  const { urlname } = useParams();
  return <DigitalMenu urlname={urlname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:urlname" element={<MenuRoute />} />
      </Routes>
    </BrowserRouter>
  );
}