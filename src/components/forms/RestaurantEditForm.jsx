import { Button, Form, Input, Space, notification, Select, Spin } from "antd";
import React, { useState, useEffect } from "react";
import {
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from "@react-query-firebase/firestore";
import { locationsRef } from "../../utils/services/ReactQueryServices";
import { modifySelectData } from "../../utils/common";
import { get } from "lodash";
import { collection, doc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";
const { Option } = Select;

const RestaurantEditForm = (props) => {
  const [form] = Form.useForm();
  const [locationsList, setlocationsList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [restoRef, setrestoRef] = useState(null);
  const restoForm = useFirestoreDocumentMutation(restoRef);
  const queryLocations = useFirestoreQuery(["locations"], locationsRef, {
    subscribe: true,
  });

  useEffect(() => {
    form.setFieldsValue(props.editDetails);
    if (get(props, "editDetails.id", false)) {
      setrestoRef(
        doc(collection(db, "restaurants"), get(props, "editDetails.id", ""))
      );
    }
  }, [props.editDetails]);

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
        message: `Restaurant Updated`,
        description: `Restaurant ${restoForm.variables.name} updated successfully`,
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      setrestoRef(null);
    } else if (restoForm.isError) {
      api.error({
        message: `Restaurant updation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [restoForm.isSuccess]);

  const onFinish = (values) => {
    restoForm.mutate({ ...values, id: props.editDetails.id });
  };

  return (
    <Spin spinning={restoForm.isLoading}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="name" label="Restaurant">
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter restaurant name"
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
          <Select placeholder="Please select a location">
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
          />
        </Form.Item>
        <Space>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form>

      {contextHolder}
    </Spin>
  );
};
export default RestaurantEditForm;
