import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { Button, Col, DatePicker, Form, Radio, Row, Select, Space } from "antd";
import { get } from "lodash";
import React, { useState, useRef } from "react";
import {
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
import { collection, query, where, getDocs } from "firebase/firestore";
import RenderControl from "../../components/common/RenderControl";
import { db } from "../../utils/firebase/firebaseConfig";
import dayjs from "dayjs";
import ComponentToPrint, { ComponentPrint } from "../common/ComponentToPrint";
import ReactToPrint from "react-to-print";
import { StyledDiv } from "../common/StyledGuide";
import { PDFViewer } from "@react-pdf/renderer";
const { RangePicker } = DatePicker;
const initial = {
  restaurant: "",
  location: "",
  dateFrom: "",
  dateTo: "",
  reportType: true,
  hitCall: false,
};

const { Option } = Select;
const ExportForm = (props) => {
  const componentRef = useRef();
  const [exportState, setexportState] = useState(initial);
  const [restoList, setrestoList] = useState([]);
  const [locationList, setlocationList] = useState([]);
  const [reports, setreports] = useState({
    alldocs: [],
    total: 0,
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
    setexportState({
      ...exportState,
      [type]: value,
    });
  };

  const reportApi = async () => {
    const ordersRef = collection(db, "orders");
    const orderQuery = query(
      ordersRef,
      where("name", "==", exportState.restaurant),
      where("location", "==", exportState.location),
      where("date", ">=", exportState.dateFrom),
      where("date", "<=", exportState.dateTo)
    );
    const finalResult = await getDocs(orderQuery);
    let finalArray = [];
    finalResult.forEach((doc) => {
      finalArray.push({ id: doc.id, ...doc.data() });
    });
    let totalSum = finalArray.reduce((n, { value }) => n + value, 0);
    setreports({
      alldocs: finalArray,
      total: totalSum,
    });
  };

  const handleCalendarChange = (time, timeString) => {
    // setexportState({
    //   ...exportState,
    //   date: value,
    // });
  };

  const handleTimeChange = (value, dateString) => {
    setexportState({
      ...exportState,
      dateFrom: dayjs(dateString).startOf("date").unix(),
      dateTo: dayjs(dateString).endOf("date").unix(),
    });
  };

  const handleSubmit = () => {
    reportApi();
    // setexportState({
    //   ...exportState,
    //   hitCall: true,
    // });
  };

  console.log("reports", reports);

  return (
    // <RenderControl
    //   loading={!queryRestaurants.isFetched || !queryLocations.isFetched}
    //   ready={queryRestaurants.isFetched && queryLocations.isFetched}
    // >
    <>
      <Form layout="vertical">
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
                <DatePicker format={"DD/MM/YYYY"} onChange={handleTimeChange} />
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
      </Space>
      <PDFViewer>
        <ComponentToPrint />
      </PDFViewer>
    </>
    // </RenderControl>
  );
};

export default ExportForm;
