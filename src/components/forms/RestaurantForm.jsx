import { Button, Form, Input, Space, notification, Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import {
  useFirestoreCollectionMutation,
  useFirestoreQuery,
} from "@react-query-firebase/firestore";
import {
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
import { modifySelectData } from "../../utils/common";
import { get } from "lodash";
const { Option } = Select;
const initial = {
  name: "",
  location: "",
  phone: "",
};

const RestaurantForm = (props) => {
  const [form] = Form.useForm();
  const [restState, setrestState] = useState(initial);
  const [locationsList, setlocationsList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const restoForm = useFirestoreCollectionMutation(restaurantsRef);
  const queryLocations = useFirestoreQuery(["locations"], locationsRef, {
    subscribe: true,
  });

  useEffect(() => {
    if (queryLocations.isFetched) {
      const fetchLocations = queryLocations.data?.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      let finalLocations = modifySelectData(fetchLocations);
      setlocationsList(finalLocations);
    }
  }, [queryLocations.isFetched]);

  useEffect(() => {
    if (restoForm.isSuccess) {
      api.success({
        message: `Restaurant Created`,
        description: (
          <div>
            Restaurant <b>{restoForm.variables.name}</b> created successfully
          </div>
        ),
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      form.resetFields();
      setrestState(initial);
    } else if (restoForm.isError) {
      api.error({
        message: `Restaurant creation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [restoForm.isSuccess]);

  const handleState = (value, type) => {
    setrestState({
      ...restState,
      [type]: value,
    });
  };

  const handleSubmit = () => {
    restoForm.mutate(restState);
  };
  return (
    <>
      <Spin spinning={restoForm.isLoading}>
        <Form layout="vertical" form={form}>
          <Form.Item name="restaurant" label="Restaurant">
            <Input
              style={{
                width: "100%",
              }}
              placeholder="Please enter restaurant name"
              onChange={(e) => handleState(e.target.value, "name")}
              value={restState.name}
            />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: "Please enter location",
              },
            ]}
          >
            <Select
              placeholder="Please select a location"
              onChange={(value) => handleState(value, "location")}
              value={restState.location}
            >
              {locationsList.map((rest) => {
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
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please enter phone",
              },
            ]}
          >
            <Input
              style={{
                width: "100%",
              }}
              placeholder="Please enter phone"
              onChange={(e) => handleState(e.target.value, "phone")}
              value={restState.phone}
            />
          </Form.Item>
          <Space>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        </Form>
      </Spin>
      {contextHolder}
    </>
  );
};
export default RestaurantForm;
