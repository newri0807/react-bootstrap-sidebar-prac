import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

const Tables = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
    },
    {
      dataField: "first_name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "email",
    },
    {
      dataField: "gender",
      text: "gender",
    },
    {
      dataField: "ip_address",
      text: "ip_address",
    },
  ];

  const navigate = useNavigate();

  const handleRowClick = (e) => {
    //console.log(e.target.parentElement.rowIndex);
    // 클릭된 행의 id 값을 추출하여 path 생성
    const path = `/Table_detail/${e.target.parentElement.rowIndex}`;
    // path로 페이지 이동
    navigate(path);
  };

  const rowEvents = {
    onClick: handleRowClick,
  };

  return (
    <div className="right_container">
      <Container style={{ margin: "80px auto " }}>
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={data}
          columns={columns}
          pagination={paginationFactory({
            sizePerPage: 15,
            isRemotePagination: true,
          })}
          rowEvents={rowEvents}
        />
      </Container>
    </div>
  );
};

export default Tables;
