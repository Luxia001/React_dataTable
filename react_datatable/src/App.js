import logo from "./logo.svg";
import "./App.css";

import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import axios from "axios";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
    width: "100px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "200px",
  },
  {
    name: "Coverimage",
    selector: (row) => row.coverimage,
    sortable: true,
    cell: (row) => <img src={row.coverimage} width={100} alt={row.name} />,
    width: "200px",
  },
  {
    name: "Detail",
    selector: (row) => row.detail,
    sortable: true,
    width: "200px",
  },

  {
    name: "Latitude",
    selector: (row) => row.latitude,
    sortable: true,
  },
  {
    name: "Longitude",
    selector: (row) => row.longitude,
    sortable: true,
  },
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("");
  const [sortColumnDir, setSortColumnDir] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);

    var url = `http://localhost:5000/api/attractions?page=${page}&per_page=${perPage}`;

    if (search) {
      url += `&search=${search}`;
    }

    if (sortColumn) {
      url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
    }

    const response = await axios.get(url);

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);

    const response = await axios.get(
      `http://localhost:5000/api/attractions?page=${page}&per_page=${newPerPage}&delay=1`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // fetch page 1 of users
  }, [page, perPage, sortColumn, sortColumnDir]);

  const handleSort = (column, sortDirection) => {
    setSortColumn(column.name);
    setSortColumnDir(sortDirection);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <label>
          Search:
          <input type="text" name="search" onChange={handleSearchChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <DataTable
        title="Attraction"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
      />
    </div>
  );
}

export default App;
