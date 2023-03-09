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
import React, { useState } from "react";
import {
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";
import dayjs from "dayjs";
import { PDFViewer } from "@react-pdf/renderer";
import Invoice from "../../containers/invoice/Invoice";
import { StyledDiv } from "../common/StyledGuide";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
const { RangePicker } = DatePicker;
const initial = {
  restaurant: "",
  location: "",
  dateFrom: "",
  dateTo: "",
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
  const [api, contextHolder] = notification.useNotification();

  const [reports, setreports] = useState({
    alldocs: [],
    total: 0,
    currentDate: null,
  });

  const queryRestaurants = useFirestoreQuery(
    ["retaurants"],
    restaurantsRef,
    {
      subscribe: true,
    },
    {
      onSuccess: (response) => {
        const fetchRestaurants = response.docs.map((docSnapshot) => {
          const doc = docSnapshot.data();
          return doc;
        });
        setrestoList(fetchRestaurants);
      },
    }
  );
  const queryLocations = useFirestoreQuery(
    ["locations"],
    locationsRef,
    {
      subscribe: true,
    },
    {
      onSuccess: (response) => {
        let finalLocations = response.docs.map((docSnapshot) => {
          const doc = docSnapshot.data();
          return doc;
        });
        setlocationList(finalLocations);
      },
    }
  );
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
    if (exportState.dateFrom !== "")
      queryContraints.push(where("date", ">", exportState.dateFrom));
    if (exportState.dateTo !== "")
      queryContraints.push(where("date", "<", exportState.dateTo));
    const orderQuery = query(collection(db, "orders"), ...queryContraints);
    const finalResult = await getDocs(orderQuery)
      .then((response) => {
        let finalArray = [];
        response.forEach((doc) => {
          finalArray.push({ id: doc.id, ...doc.data() });
        });
        let totalSum = finalArray.reduce((n, { value }) => n + value, 0);
        setreports({
          alldocs: finalArray,
          total: totalSum,
          currentDate: dayjs().format("LLL"),
        });
        setexportState({
          ...exportState,
          hitCall: true,
          loading: false,
        });
      })
      .catch((error) => {
        api.error({
          message: `Report generation failed !`,
          description: `Something went wrong while pulling the report. Please contact the administrator.`,
          placement: "bottomRight",
        });
      });
  };

  const handleCalendarChange = (time) => {
    setexportState({
      ...exportState,
      dateFrom: dayjs(time[0]).startOf("date").unix(),
      dateTo: dayjs(time[1]).endOf("date").unix(),
    });
  };

  const handleTimeChange = (value, dateString) => {
    setexportState({
      ...exportState,
      dateFrom: dayjs(dateString).startOf("date").unix(),
      dateTo: dayjs(dateString).endOf("date").unix(),
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
      </>
      <StyledDiv position="absolute" bottom={"60px"}>
        {/* <ErrorBoundary> */}
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
        {/* </ErrorBoundary> */}
      </StyledDiv>
      {contextHolder}
    </>
  );
};

export default ExportForm;
