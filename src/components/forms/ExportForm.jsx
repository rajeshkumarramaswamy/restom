import { useFirestoreQuery } from "@react-query-firebase/firestore";
import {
  Button,
  Col,
  DatePicker,
  TimePicker,
  Form,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import {
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
import RenderControl from "../../components/common/RenderControl";
const { RangePicker } = DatePicker;
const initial = {
  restaurant: "",
  location: "",
  date: "",
  reportType: true,
};
const { Option } = Select;
const ExportForm = (props) => {
  const [exportState, setexportState] = useState(initial);
  const [restoList, setrestoList] = useState([]);
  const [locationList, setlocationList] = useState([]);
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

  const handleCalendarChange = (time, timeString) => {
    console.log("value", time, timeString);
    // setexportState({
    //   ...exportState,
    //   date: value,
    // });
  };

  const handleTimeChange = (value, dateString) => {
    console.log("value", value, dateString);
  };

  const handleSubmit = () => {
    console.log("exportState", exportState);
  };

  console.log("exportState", exportState, restoList, locationList);

  return (
    <RenderControl
      loading={!queryRestaurants.isFetched || !queryLocations.isFetched}
      ready={queryRestaurants.isFetched && queryLocations.isFetched}
    >
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
            <Row gutter={2}>
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
              <Col span={12}>
                <Form.Item
                  name="dateReport"
                  label="Select time"
                  rules={[
                    {
                      required: true,
                      message: "Day report",
                    },
                  ]}
                >
                  <TimePicker.RangePicker
                    showTime
                    onChange={handleTimeChange}
                    value={exportState.date}
                  />
                </Form.Item>
              </Col>
            </Row>
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
    </RenderControl>
  );
};

export default ExportForm;
