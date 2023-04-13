import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "auto",
        minHeight: "100vh",
        overflow: "scroll initial",
      }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Sidebar
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact="true" to="/" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/tables" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="table">Tables</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/tables2" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="user">Tables 2</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/tables3" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                Tables 3
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/queryPrac" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                QueryPrac
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/hero404"
              target="_blank"
              activeclassname="activeClicked"
            >
              <CDBSidebarMenuItem icon="exclamation-circle">
                404 page
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "20px 5px",
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
