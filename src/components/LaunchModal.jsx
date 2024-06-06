import React from "react";
import { Modal, Box, Typography, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

const LaunchModal = ({ open, handleClose, launch }) => {
  if (!launch) return null;

  const success = launch.success;
  const upcoming = launch.upcoming;
  const status = upcoming ? "Upcoming" : success ? "Success" : "Failed";

  const patchImage = launch.links.patch ? launch.links.patch.small : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="launch-modal-title"
      aria-describedby="launch-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="launch-modal-title" variant="h6" component="h2">
            {launch.name} - {status}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" my={2}>
          {patchImage && (
            <img
              src={patchImage}
              alt={launch.name}
              style={{ width: 50, marginRight: 10 }}
            />
          )}
          <Typography variant="subtitle1" color="textSecondary" mr={1}>
            {launch.rocket_name}
          </Typography>
          {upcoming ? (
            <Typography variant="subtitle1" color="primary">
              Upcoming
            </Typography>
          ) : success ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" />
          )}
        </Box>
        <Typography id="launch-modal-description" sx={{ mt: 2 }}>
          {launch.details}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              <strong>Flight Number:</strong> {launch.flight_number}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              <strong>Rocket Type:</strong> {launch.rocket_name + " " + launch.rocket_type || "N/A"}
            </Typography>
          </Grid>
          {launch.payloads.map((payload, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Manufacturer:</strong> {payload.manufacturers[0] || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Nationality:</strong>{" "}
                  {payload.nationalities
                    ? payload.nationalities.join(", ")
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Payload Type:</strong> {payload.type || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Orbit:</strong> {payload.orbit || "N/A"}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <strong>Launch Date:</strong>{" "}
              {new Date(launch.date_utc).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <strong>Launch Site:</strong> {launch.launchpad_name}
            </Typography>
          </Grid>
          {launch.links.article && (
            <Grid item xs={12}>
              <Typography variant="body2" color="primary">
                <strong>Article:</strong>{" "}
                <a
                  href={launch.links.article}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {launch.links.article}
                </a>
              </Typography>
            </Grid>
          )}
          {launch.links.webcast && (
            <Grid item xs={12}>
              <Typography variant="body2" color="primary">
                <strong>Video:</strong>{" "}
                <a
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {launch.links.webcast}
                </a>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default LaunchModal;
