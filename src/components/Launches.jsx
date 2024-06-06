import React, { useContext, useState, useEffect } from "react";
import useAllLaunches from "../utils/useAllLaunches";
import Shimmer from "./Shimmer";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import LaunchModal from "./LaunchModal";
import { LaunchStatusContext } from "../utils/LaunchContext";
import { isWithinInterval } from 'date-fns';

const Launches = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedLaunchStatus, selectedDateRange } = useContext(LaunchStatusContext);

  const columns = [
    { id: "flight_number", name: "No:" },
    { id: "launch_date_utc", name: "Launched(UTC)" },
    { id: "launchpad_name", name: "Location" },
    { id: "name", name: "Mission" },
    { id: "orbit", name: "Orbit" },
    { id: "launch_success", name: "Launch Status" },
    { id: "rocket_name", name: "Rocket" },
  ];

  const { launchInfo, loading } = useAllLaunches();

  useEffect(() => {
    setPage(0);
  }, [selectedLaunchStatus, selectedDateRange]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (launch) => {
    setSelectedLaunch(launch);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLaunch(null);
  };

  const getStatus = (item) => {
    if (item.upcoming) return <span className="p-2 rounded-lg bg-yellow-100 font-semibold">Upcoming</span>;
    return item.success ? <span className="p-2 rounded-lg bg-green-100 font-semibold">Success</span> : <span className="p-2 rounded-lg bg-red-100 font-semibold">Failed</span>;
  };

  const filteredLaunches = launchInfo.filter((launch) => {
    if (selectedLaunchStatus !== 'All Launches') {
      if (selectedLaunchStatus === 'Upcoming Launches' && !launch.upcoming) return false;
      if (selectedLaunchStatus === 'Successful Launches' && !launch.success) return false;
      if (selectedLaunchStatus === 'Failed Launches') {
        if (launch.upcoming || launch.success) return false;
      }
    }

    if (!selectedDateRange || !selectedDateRange.startDate || !selectedDateRange.endDate) {
      return true;
    }

    const launchDate = new Date(launch.date_utc);
    const { startDate, endDate } = selectedDateRange;
    return isWithinInterval(launchDate, { start: startDate, end: endDate });
  });

  const paginatedLaunches = filteredLaunches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div className="mt-3 items-center font-semibold">
      <Paper sx={{ width: "90%", marginLeft: "6%", marginBottom: "5%" }}>
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-300 font-semibold">
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1rem', color: '#333' }}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Shimmer />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLaunches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{fontSize: '1.2rem'}}>
                      No Data Found for the specific filter
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLaunches.map((item, index) => (
                    <TableRow key={index} onClick={() => handleRowClick(item)}  sx={{
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}>
                      <TableCell>{item.flight_number}</TableCell>
                      <TableCell>{new Date(item.date_utc).toLocaleString()}</TableCell>
                      <TableCell>{item.launchpad_name}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.orbit || 'N/A'}</TableCell>
                      <TableCell>{getStatus(item)}</TableCell>
                      <TableCell>{item.rocket_name}</TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredLaunches.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
      <LaunchModal open={modalOpen} handleClose={handleCloseModal} launch={selectedLaunch} />
    </div>
  );
};

export default Launches;
