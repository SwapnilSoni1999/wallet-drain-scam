import React from "react";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Vote from "./Pages/Vote";
import Elections from "./Pages/Elections";
import Create from "./Pages/Create";
import Election from "./Pages/Election";
import SnapShot from "./Pages/SnapShot";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/elections/:id" element={<Election />} />
            <Route path="elections/:id/snapshot" element={<SnapShot />} />
            <Route path="/create" element={<Create />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default Router;
