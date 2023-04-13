/* eslint-disable react/jsx-pascal-case */
import React from "react";
import "./App.css";
import Sidebar from "./component/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Tables from "./page/Tables";
import Table_detail from "./page/Table_detail";
import Tables2 from "./page/Tables2";
import Tables3 from "./page/Tables3";
import QueryPrac from "./page/QueryPrac";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="wrap_container">
        <Router>
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/Table_detail/:tableId" element={<Table_detail />} />
            <Route path="/tables2" element={<Tables2 />} />
            <Route path="/tables3" element={<Tables3 />} />
            <Route path="/queryPrac" element={<QueryPrac />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
