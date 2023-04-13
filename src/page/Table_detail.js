import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";

const Table_detail = () => {
  const params = useParams().tableId;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((json) =>
        setData(json.filter((item) => item.id === Number(params)))
      )
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="right_container">
      <Container>
        <h4>Table_detail {params}</h4>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <h5>
                {item.first_name} {item.last_name}
              </h5>
              <p>{item.email}</p>
              <p>{item.gender}</p>
              <p>{item.ip_address}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};

export default Table_detail;
