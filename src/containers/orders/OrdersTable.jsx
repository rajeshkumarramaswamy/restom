import { Space, Table, Tag } from "antd";
import React from "react";
import Icon, { EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { GetOrders, GetRestaurants } from "../../utils/api/api";
import RenderControl from "../../components/common/RenderControl";
import { get } from "lodash";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { ordersRef } from "../../utils/services/ReactQueryServices";

const statusColor = {
  completed: "green",
  failed: "red",
};
const columns = [
  {
    title: "Restaurant",
    dataIndex: "restaurantName",
    // dataIndex: ["_fieldsProto", "restaurantName", "stringValue"],
    key: "restaurant",
    align: "center",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Driver",
    // dataIndex: ["_fieldsProto", "driver", "stringValue"],
    dataIndex: "driver",
    key: "driver",
  },
  {
    title: "Miles",
    // dataIndex: ["_fieldsProto", "miles", "integerValue"],
    dataIndex: "miles",
    key: "miles",
  },
  {
    title: "MileageStart",
    // dataIndex: ["_fieldsProto", "mileageStart", "integerValue"],
    dataIndex: "mileageStart",
    key: "mileageStart",
  },
  {
    title: "MileageEnd",
    // dataIndex: ["_fieldsProto", "mileageEnd", "integerValue"],
    dataIndex: "mileageEnd",
    key: "mileageEnd",
  },
  {
    title: "Value",
    // dataIndex: ["_fieldsProto", "orderValue", "integerValue"],
    dataIndex: "orderValue",
    key: "value",
  },
  {
    title: "Date",
    // dataIndex: ["_fieldsProto", "date", "stringValue"],
    dataIndex: "date",
    key: "date",
  },

  {
    title: "Location",
    // dataIndex: ["_fieldsProto", "location", "stringValue"],
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Status",
    key: "tags",
    // dataIndex: ["_fieldsProto", "tags", "stringValue"],
    dataIndex: "tags",
    render: (_, render) => {
      console.log("render", render);
      return (
        <>
          <Tag
            color={
              statusColor[get(render, "_fieldsProto.status.stringValue", "")]
            }
            key={get(render, "_fieldsProto.status.stringValue", "")}
          >
            {get(render, "_fieldsProto.status.stringValue", "").toUpperCase()}
          </Tag>
        </>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
      </Space>
    ),
  },
];

const OrdersTable = () => {
  const queryOrders = useFirestoreQuery(["orders"], ordersRef);
  const fetchOrders = queryOrders.data?.docs.map((docSnapshot) => {
    const doc = docSnapshot.data();
    return doc;
  });

  const tableProps = {
    bordered: true,
  };
  return (
    <RenderControl
      loading={queryOrders.isLoading}
      error={queryOrders.isError}
      ready={queryOrders?.data}
    >
      <Table
        {...tableProps}
        columns={columns}
        dataSource={fetchOrders}
        scroll={{
          y: 375,
        }}
      />
    </RenderControl>
  );
};
export default OrdersTable;
