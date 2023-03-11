import { useFirestoreQuery } from "@react-query-firebase/firestore";
import {
  Button,
  Col,
  DatePicker,
  Form,
  notification,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import {
  driversRef,
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";
import dayjs from "dayjs";
import { PDFViewer } from "@react-pdf/renderer";
import Invoice from "../../containers/invoice/Invoice";
import { StyledDiv } from "../common/StyledGuide";
const { RangePicker } = DatePicker;
const initial = {
  restaurant: "",
  location: "",
  dateFrom: 0,
  dateTo: 0,
  driver: "",
  reportType: true,
  hitCall: false,
  loading: false,
};

const { Option } = Select;
const ExportForm = (props) => {
  const [form] = Form.useForm();
  const [exportState, setexportState] = useState(initial);
  const [restoList, setrestoList] = useState([]);
  const [locationList, setlocationList] = useState([]);
  const [driverList, setdriverList] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [reports, setreports] = useState({
    alldocs: [],
    total: 0,
    currentDate: null,
  });

  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef, {
    subscribe: true,
  });
  const queryLocations = useFirestoreQuery(["locations"], locationsRef, {
    subscribe: true,
  });
  const queryDrivers = useFirestoreQuery(["drivers"], driversRef, {
    subscribe: true,
  });

  useEffect(() => {
    if (queryRestaurants.isSuccess) {
      const fetchRestaurants = queryRestaurants.data.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      setrestoList(fetchRestaurants);
    }
  }, [queryRestaurants.isSuccess]);

  useEffect(() => {
    if (queryLocations.isSuccess) {
      const fetchLocations = queryLocations.data.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      setlocationList(fetchLocations);
    }
  }, [queryLocations.isSuccess]);

  useEffect(() => {
    if (queryDrivers.isSuccess) {
      const finalDrivers = queryDrivers.data.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      setdriverList(finalDrivers);
    }
  }, [queryDrivers.isSuccess]);

  const onSelectChange = (value, type) => {
    setreports({
      alldocs: [],
      total: 0,
      currentDate: null,
    });
    setexportState({
      ...exportState,
      [type]: value,
    });
  };

  const reportApi = async () => {
    const queryContraints = [];
    if (exportState.restaurant !== "")
      queryContraints.push(where("name", "==", exportState.restaurant));
    if (exportState.location !== "")
      queryContraints.push(where("location", "==", exportState.location));
    if (exportState.driver !== "")
      queryContraints.push(where("driver", "==", exportState.driver));
    if (exportState.dateFrom !== 0)
      queryContraints.push(where("date", ">", parseInt(exportState.dateFrom)));
    if (exportState.dateTo !== 0)
      queryContraints.push(where("date", "<", parseInt(exportState.dateTo)));
    queryContraints.push(where("paid", "==", false));
    const orderQuery = query(collection(db, "orders"), ...queryContraints);
    console.log("orderQuery", orderQuery);
    const finalResult = await getDocs(orderQuery)
      .then((response) => {
        let finalArray = [];
        response.forEach((doc) => {
          finalArray.push({ id: doc.id, ...doc.data() });
        });
        let totalSum = finalArray.reduce((n, { value }) => n + value, 0);
        let totalDeliveryCharges = finalArray.reduce(
          (n, { deliveryCharge }) => n + deliveryCharge,
          0
        );
        let paidonDelivery = finalArray.reduce(
          (n, { value }) => n || 0 + value,
          0
        );

        setreports({
          alldocs: finalArray,
          total: totalSum,
          deliveryCharges: totalDeliveryCharges,
          paidonDelivery: paidonDelivery,
          currentDate: dayjs().format("LLL"),
        });
        setexportState({
          ...exportState,
          hitCall: true,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("error", error);
        api.error({
          message: `Report generation failed !`,
          description: `Something went wrong while fetching the report. Please try again later or contact the administrator.`,
          placement: "bottomRight",
        });
        resetPage();
      });
  };

  const handleCalendarChange = (time) => {
    setexportState({
      ...exportState,
      dateFrom: parseInt(dayjs(time[0]).startOf("date").unix()),
      dateTo: parseInt(dayjs(time[1]).endOf("date").unix()),
    });
  };

  const handleTimeChange = (value, dateString) => {
    setexportState({
      ...exportState,
      dateFrom: parseInt(dayjs(value).startOf("date").unix()),
      dateTo: parseInt(dayjs(value).endOf("date").unix()),
    });
  };

  const handleSubmit = () => {
    setexportState({
      ...exportState,
      loading: true,
    });
    reportApi();
  };

  const resetPage = () => {
    form.resetFields();
    setexportState(initial);
    setreports({
      alldocs: [],
      total: 0,
      currentDate: null,
    });
  };

  return (
    <>
      <>
        <Spin
          spinning={
            queryRestaurants.isLoading ||
            queryDrivers.isLoading ||
            queryLocations.isLoading
          }
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              name="restaurant"
              label="Restaurant"
              rules={[
                {
                  required: true,
                  message: "Please select restaurant",
                },
              ]}
            >
              <Select
                placeholder="Please select a restaurant"
                onChange={(value) => onSelectChange(value, "restaurant")}
                value={exportState.restaurant}
                allowClear
                onClear={resetPage}
                loading={queryRestaurants.isLoading}
              >
                {restoList?.map((rest) => {
                  return (
                    <Option
                      key={get(rest, "name", "")}
                      value={get(rest, "name", "")}
                    >
                      {get(rest, "name", "")}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: "Please select location",
                },
              ]}
            >
              <Select
                placeholder="Please select a location"
                onChange={(value) => onSelectChange(value, "location")}
                value={exportState.location}
                onClear={resetPage}
                loading={queryLocations.isLoading}
              >
                {locationList?.map((rest) => {
                  return (
                    <Option
                      key={get(rest, "name", "")}
                      value={get(rest, "name", "")}
                    >
                      {get(rest, "name", "")}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="driver" label="Driver">
              <Select
                placeholder="Please select a driver"
                onChange={(value) => onSelectChange(value, "driver")}
                value={exportState.driver}
                onClear={resetPage}
                loading={queryDrivers.isLoading}
              >
                {driverList?.map((rest) => {
                  return (
                    <Option
                      key={get(rest, "firstName", "")}
                      value={get(rest, "firstName", "")}
                    >
                      {`${get(rest, "firstName", "")} ${get(
                        rest,
                        "lastName",
                        ""
                      )}`}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Row>
              <Form.Item label="Report Type">
                <Radio.Group>
                  <Radio
                    defaultChecked={exportState.reportType}
                    onChange={() =>
                      setexportState({ ...exportState, reportType: true })
                    }
                  >
                    Day report{" "}
                  </Radio>
                  <Radio
                    value={!exportState.reportType}
                    onChange={() =>
                      setexportState({ ...exportState, reportType: false })
                    }
                  >
                    Date range report{" "}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Row>

            <Row>
              {exportState.reportType ? (
                <Col span={12}>
                  <Form.Item
                    name="dateReport"
                    label="Select date"
                    rules={[
                      {
                        required: true,
                        message: "Day report",
                      },
                    ]}
                  >
                    <DatePicker
                      format={"DD/MM/YYYY"}
                      onChange={handleTimeChange}
                    />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="Dates between"
                    rules={[
                      {
                        required: true,
                        message: "Please select date",
                      },
                    ]}
                  >
                    <RangePicker
                      onChange={handleCalendarChange}
                      value={exportState.date}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
          <Space>
            <Button onClick={props.onClose}>Cancel</Button>

            <Button type="primary" onClick={handleSubmit}>
              Export
            </Button>
            <Button onClick={resetPage}>Reset</Button>
          </Space>
        </Spin>
      </>
      <StyledDiv position="absolute" bottom={"10px"}>
        <Spin spinning={exportState.loading}>
          {exportState.hitCall && reports.alldocs.length > 0 ? (
            <PDFViewer>
              <Invoice invoice={reports} />
            </PDFViewer>
          ) : (
            exportState.hitCall &&
            reports.alldocs.length === 0 && (
              <StyledDiv fontWeight="600" fontSize="30px" fontColor="lightgray">
                No reports found
              </StyledDiv>
            )
          )}
        </Spin>
      </StyledDiv>
      {contextHolder}
    </>
  );
};

export default ExportForm;
