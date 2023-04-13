import React, { useEffect, useState } from "react";
import Pagination from "../component/Pagenation";
import axios from "axios";
import { Container, Table, Form, Modal } from "react-bootstrap";

const List = () => {
  const [listInfo, setListInfo] = useState([]);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const dateNow = new Date();
  const today = dateNow.toISOString().slice(0, 10);
  const oneMonthAgo = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth() - 1,
    dateNow.getDate()
  );
  const [startDate, setStartDate] = useState(
    oneMonthAgo.toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    getListData();
  }, [skip, limit, searchTerm, startDate, endDate]);

  useEffect(() => {
    if (id) {
      axios
        .get("/data/data.json")
        .then((res) => {
          const filteredData = res.data.filter((item) => item.id === id);
          setModalData(filteredData[0]);
          setIsModalOpen(true);
        })
        .catch((err) => alert("정보를 불러오는데에 실패했습니다."));
    }
  }, [id]);
  const getListData = () => {
    axios
      .get("/data/data.json")
      .then((res) => {
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const filteredData = res.data
          .filter((data) => {
            return (
              (data.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                data.last_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                data.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
              (!startDate || data.date >= startDate) &&
              (!endDate || data.date <= endDate)
            );
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(startIndex, endIndex);

        if (filteredData.length > 0) {
          setListInfo(filteredData);
        } else {
          setListInfo([]);
        }
      })
      .catch((err) => alert("정보를 불러오는데에 실패했습니다."));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSkip((page - 1) * limit);
    getListData(); // 페이지 변경시 getListData() 호출
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  };

  const handleRowClick = (e) => {
    const id = e.target.parentElement.rowIndex;
    setId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="right_container">
      <Container style={{ margin: "80px auto " }}>
        <div className="row">
          <Form.Group
            className="mb-3 col-md-4 col-xs-12"
            style={{
              display: "flex",
              height: "39px",
              verticalAlign: "middle",
              alignItems: "center",
            }}
          >
            <Form.Label
              style={{
                minWidth: "95px",
                marginBottom: "0px",
              }}
            >
              기간 검색:
            </Form.Label>
            <Form.Control
              type="date"
              onChange={handleStartDate}
              value={startDate}
              style={{ marginRight: "10px" }}
            />
            <Form.Control
              type="date"
              onChange={handleEndDate}
              value={endDate}
              style={{ marginLeft: "10px" }}
            />
          </Form.Group>
          <Form.Group className="mb-3 col-md-4 col-xs-12">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              onChange={handleSearch}
            />
          </Form.Group>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>성별</th>
              <th>ip주소</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {listInfo.length > 0 ? (
              listInfo.map((item, idx) => {
                if (listInfo.length > 0) {
                  return (
                    <tr key={item.id} onClick={handleRowClick}>
                      <td>{item.id}</td>
                      <td>
                        {item.first_name} {item.last_name}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.gender}</td>
                      <td>{item.ip_address}</td>
                      <td>{item.date ? item.date : "-"}</td>
                    </tr>
                  );
                }
                return null;
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onPageChange={handlePageChange}
          setSkip={setSkip}
          startDate={startDate}
          endDate={endDate}
        />
        {modalData && (
          <Modal
            show={isModalOpen}
            onHide={handleCloseModal}
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>상세 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul className="modal-list">
                <li>
                  <span>이름:</span> {modalData.first_name}{" "}
                  {modalData.last_name}
                </li>
                <li>
                  <span>이메일:</span> {modalData.email}
                </li>
                <li>
                  <span>성별:</span> {modalData.gender}
                </li>
                <li>
                  <span>IP 주소:</span> {modalData.ip_address}
                </li>
              </ul>
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default List;
