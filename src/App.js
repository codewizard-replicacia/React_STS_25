import React, { useState } from "react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import clsx from "clsx";
import { CssBaseline, makeStyles } from "@material-ui/core";
import AppHeader, { drawerWidth } from "./components/app-header/app-header_index";
import TripTable from "./views/Trip_table/Trip_index";
import RouteTable from "./views/Route_table/Route_index";
import ViewTrip from "./views/Trip_details/Trip_view";
import CreateTripForm from "./views/Trip_details/Trip_createForm";
import EditTripForm from "./views/Trip_details/Trip_editForm";
import ViewRoute from "./views/Route_details/Route_view";
import CreateRouteForm from "./views/Route_details/Route_createForm";
import EditRouteForm from "./views/Route_details/Route_editForm";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    marginLeft: theme.spacing(9),
    width: `calc(100% - ~{theme.spacing(7) + 10}px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ~{theme.spacing(9) + 10}px)`,
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ~{drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();

  return (
    <div className="App">
      <BrowserRouter>
        <SnackbarProvider maxSnack={1} autoHideDuration={2500}>
          <CssBaseline />
          <AppHeader onDrawerChange={setDrawerOpen} />
          <main
            className={clsx(classes.content, {
              [classes.appBarShift]: drawerOpen,
            })}
          >
            <div className={classes.toolbar} />
            <Routes>

              <Route path="/Trips" element={<TripTable />} />
              <Route path="/Routes" element={<RouteTable />} />
              <Route path="/Trips/edit/:id" element={<EditTripForm />}/>
              <Route path="/Trips/view/:id" element={<ViewTrip />} />
              <Route path="/Trips/create" element={<CreateTripForm />} />
              <Route path="/Routes/edit/:id" element={<EditRouteForm />}/>
              <Route path="/Routes/view/:id" element={<ViewRoute />} />
              <Route path="/Routes/create" element={<CreateRouteForm />} />
            </Routes>
          </main>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
