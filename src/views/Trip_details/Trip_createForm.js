
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BASE_URL,
  PATH_BUS,
  PATH_TRIP,
  PATH_DRIVER,
  PATH_ROUTE,
  } from '../../utils/constants';
import makeApiCall from '../../utils/makeApiCall';
import moment from 'moment';
import MuiSelect from '../../components/select/select_index';
import MuiDatePicker from '../../components/date-picker/date-picker'
import { useSnackbar } from 'notistack';
import { tripViewConfig } from '../../utils/display_configuration';

const useStyles = makeStyles((theme) => ({
  table: {
    margin: '0 auto',
    width: '90%',
  },
  titleCell: {
    width: '35%',
    textAlign: 'right',
    borderBottom: 'none',
  },
  valueCell: {
    textAlign: 'left',
    borderBottom: 'none',
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const CreateTripForm = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const styles = useStyles();

  const [formData, setFormData] = useState({});
        const [errorData, setErrorData] = useState({});


  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const typesResponse = await makeApiCall(
        `${BASE_URL}${PATH_ROUTE}`
      );
      const jsonResp = await typesResponse.json();
      setRoutes(jsonResp.value);
    };
    fetchRoutes();
  }, []);

  const handleChange = (key, value) => {
    setFormData({ ...formData, ...{ [key]: value } });
  };

  const submitForm = async () => {
          const { 
        TripId,
      ...otherData } = formData;

      try {
        const resp = await makeApiCall(
          `${BASE_URL}${PATH_TRIP}`,
          'POST',
          JSON.stringify({
            ...otherData,
                          })
        );

        if (resp.ok) {
          snackbar.enqueueSnackbar('Successfully created Trip', {
            variant: 'success',
          });
          navigate({ pathname: '/trips' });
        } else {
          const jsonData = await resp.json();
          snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
            variant: 'error',
          });
        }
      } catch (error) {
        // Handle any errors that occur during the API calls or processing
        snackbar.enqueueSnackbar(`Error: ${error.message}`, {
          variant: 'error',
        });
      }
      };

  return (
    <>
      <Box padding={2}>
        <Grid>
          <Grid item lg={12} xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography className="page-heading" variant="h5">
                Create Trip
              </Typography>
              <div className="action-buttons">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className="margin-right"
                  onClick={submitForm}
                >
                  Save
                </Button>
                &nbsp;
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate({ pathname: '/trips' })}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </Grid>
          <Divider />
          <Box marginTop={2} className="form-container">
            <Grid container item lg={12} xs={12}>
              {Object.keys(tripViewConfig)?.map((config, ind) => (
                <>
                  <Grid item lg={5} md={5} xs={12}>
                    <Box marginTop={1}>
                      <Typography variant="h6">{config}</Typography>
                      <Table size="small" className={styles.table}>
                        <TableBody>
                          {tripViewConfig[config]?.map(
                            ({ key, value, type, required }) => (
                              <TableRow className="responsive-table-row">
                                <TableCell
                                  className={[
                                    styles.titleCell,
                                    'row-label',
                                  ].join(' ')}
                                >
                                  <Typography variant="body1">
                                    {value}
                                    {required ? '*' : ''}:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  className={[
                                    styles.valueCell,
                                    'row-value',
                                  ].join(' ')}
                                >
                                  {key === 'TripId' ? (
                                    <Typography variant="body1">
                                      {formData[key]}
                                    </Typography>
                                  ) : 
                                  key === 'TripRoute' ? (
                                    <MuiSelect
                                      value={
                                        formData[key]
                                          ? routes.find(
                                              (e) =>
                                                e.RouteId ===
                                                formData[key]
                                            )
                                          : ''
                                      }
                                      options={routes}
                                      error={errorData[key]}
                                      helperText={errorData[key]}
                                      valueKey="RouteName"
                                      handleChange={(e) =>
                                        handleChange(
                                          key,
                                          e.target.value.RouteId
                                        )
                                      }
                                    />
                                  ) : 
                                  type === 'date' ? (
                                    <MuiDatePicker
                                      name="Date Picker"
                                      handleChange={(e) => {
                                        handleChange(key, moment(e.target.value).format(
                                          "YYYY-MM-DDTHH:mm:ss[Z]"
                                        ))
                                      }}
                                      error={errorData}
                                    />
                                  ) : type === 'boolean' ? (
                                    <Checkbox
                                      checked={formData[key] || false}
                                      onChange={(e) =>
                                        handleChange(key, e.target.checked)
                                      }
                                    />
                                  ) : (
                                    <>
                                      <TextField
                                        name={key}
                                        fullWidth
                                        className="text-field-custom"
                                        variant="outlined"
                                        size="small"
                                        type={type}
                                        error={errorData[key]}
                                        helperText={errorData[key]}
                                        value={formData[key] || ''}
                                        onChange={(e) => {
                                          if (e.target.reportValidity()) {
                                            handleChange(key, e.target.value);
                                          }
                                        }}
                                      />
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Grid>
                  <Grid item lg={1} md={1} xs={false} />
                </>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default CreateTripForm;