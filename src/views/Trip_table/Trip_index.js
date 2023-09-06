
import { useState, useEffect, createRef } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { AddBox, Edit, Visibility } from "@material-ui/icons";
import MuiTable from "../../components/table/table_index";
import { BASE_URL, PATH_TRIP } from "../../utils/constants";
import { PATH_ROUTE } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";

function TripTable() {

  const tableRef = createRef();
  const snackbar = useSnackbar();
  const navigate =  useNavigate();



  const [Routes, setRoutes] = useState({});

  useEffect(() => {
    const fetchRoutes = async () => {
      const typesResponse = await makeApiCall(
        `${BASE_URL}${PATH_ROUTE}`
      );
      const jsonResp = await typesResponse.json();
      const types = {};
      jsonResp.value.forEach(
        (item) =>
        (types[`${item.RouteId}`] = item.RouteName)
      );
      setRoutes(types);
    };
    fetchRoutes();
  }, []);

  const columns = [
    { title: "TripId", field: "TripId", editable: "never" },
      { title: "StartTime", field: "StartTime" },
      { title: "Route Name", field: "TripRoute", lookup: Routes },
  ];
  
  const fetchData = async (query) => {
    return new Promise((resolve, reject) => {
      const { page, orderBy, orderDirection, search, pageSize } = query;
      const url = `${BASE_URL}${PATH_TRIP}`;
      let temp = url; // Initialize with the base URL
      let filterQuery = ""; // Initialize filter query as an empty string
  
      // Handle sorting
      if (orderBy) {
        temp += `?$orderby=${orderBy.field} ${orderDirection}`;
      }
  
      // Handle searching
      if (search) {
        filterQuery = `$filter=contains($screen.getSearchField().getName(), '${search}')`;
        temp += orderBy ? `&${filterQuery}` : `?${filterQuery}`;
      }
  
      // Handle pagination
      if (page > 0) {
        const skip = page * pageSize;
        temp += orderBy || search ? `&$skip=${skip}` : `?$skip=${skip}`;
      }
  
      const countUrl = search ? `${url}/$count?${filterQuery}` : `${BASE_URL}${PATH_TRIP}/$count`;
      let total = null;
  
      makeApiCall(countUrl)
        .then((res) => res.text())
        .then((e) => {
          total = parseInt(e, 10);
        })
        .then(() => makeApiCall(temp))
        .then((res) => res.json())
        .then(({ value }) => {
          return resolve({
            data: value,
            page: page,
            totalCount: total,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div className="product-container">
      {
      Object.keys(Routes).length > 0 && 
      (
        <MuiTable
          tableRef={tableRef}
          title="Trip Table"
          cols={columns}
          data={fetchData}
          size={5}
          actions={[
            {
              icon: AddBox,
              tooltip: "Add",
              onClick: () => navigate("/Trips/create"),
              isFreeAction: true,
            },
            {
              icon: Visibility,
              tooltip: "View",
              onClick: (event, rowData) =>
              navigate(`/Trips/view/${rowData.TripId}`),
            },
            {
              icon: Edit,
              tooltip: "Edit",
              onClick: (event, rowData) =>
              navigate(`/Trips/edit/${rowData.TripId}`),
            },
          ]}
          onRowDelete={async (oldData) => {
            const resp = await makeApiCall(
              `${BASE_URL}${PATH_TRIP}(${oldData.TripId})`,
              "DELETE"
            );
            if (resp.ok) {
              tableRef.current.onQueryChange();
              snackbar.enqueueSnackbar("Successfully deleted Trips", {
                variant: "success",
              });
            } else {
              const jsonData = await resp.json();
              snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
                variant: "error",
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default TripTable;
