import React, { useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useTable, usePagination, useRowSelect } from "react-table";
import axios from "axios";

function Tables3() {
  const [data, setData] = useState([]);
  // Add state for showing/hiding popup and storing selected row data
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (row) => {
    if (!row.getToggleRowSelectedProps().checked) {
      setModalData(row.original);
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    axios
      .get("/data/data.json")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => alert("정보를 불러오는데에 실패했습니다."));
  }, []);

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      let resolvedRef = ref || defaultRef;

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input
            type="checkbox"
            ref={resolvedRef}
            {...rest}
            indeterminate={indeterminate ? true : undefined}
          />
        </>
      );
    }
  );

  function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page

      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      selectedFlatRows,
      state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
      {
        columns,
        data,
      },
      usePagination,
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllPageRowsSelectedProps()}
                />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    );

    // Render the UI for your table
    return (
      <>
        <pre>
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
              },
              null,
              2
            )}
          </code>
        </pre>
        <table
          {...getTableProps()}
          className="table table-bordered table-hover"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                // Add onClick handler to row
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    if (index === 0) {
                      return (
                        <td {...cell.getCellProps()}>
                          <input
                            type="checkbox"
                            {...row.getToggleRowSelectedProps()}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        onClick={() => handleOpenModal(row)}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}

        <nav
          aria-label="Page navigation"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {">"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </li>
            <li className="page-item">
              <span className="page-link">
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
            </li>
            <li className="page-item">
              <span className="page-link" style={{ padding: "3px 10px" }}>
                | Go to page:{" "}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "100px" }}
                />
              </span>
            </li>
          </ul>
          <ul className="pagination">
            <li className="page-item">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </nav>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>

        {/* Render popup */}
        {modalData && (
          <Modal show={isModalOpen} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Selected Row Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>First Name: {modalData.first_name}</p>
              <p>Last Name: {modalData.last_name}</p>
              <p>Email: {modalData.email}</p>
              <p>Gender: {modalData.gender}</p>
              <p>IP Address: {modalData.ip_address}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "first_name",
          },
          {
            Header: "Last Name",
            accessor: "last_name",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Email",
            accessor: "email",
          },
          {
            Header: "Gender",
            accessor: "gender",
          },
          {
            Header: "IP Address",
            accessor: "ip_address",
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="right_container">
      <Container style={{ margin: "80px auto " }}>
        <Table columns={columns} data={data} />
      </Container>
    </div>
  );
}

export default Tables3;
