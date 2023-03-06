import { Space, Table, Tag } from "antd";
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import RenderControl from "../../components/common/RenderControl";
import { get } from "lodash";
import { ordersData } from "../../data/data";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { ordersRef } from "../../utils/services/ReactQueryServices";
import moment from "moment/moment";

const statusColor = {
  completed: "green",
  failed: "red",
};
const columns = [
  {
    title: "Restaurant",
    dataIndex: "name",
    key: "name",
    align: "center",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Driver",
    dataIndex: "driver",
    key: "driver",
  },
  {
    title: "Miles",
    dataIndex: "miles",
    key: "miles",
  },
  {
    title: "MileageStart",
    dataIndex: "mileageStart",
    key: "mileageStart",
  },
  {
    title: "MileageEnd",
    dataIndex: "mileageEnd",
    key: "mileageEnd",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, render) => {
      return <>{moment(render.date).format("LLL")}</>;
    },
  },

  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, render) => {
      return (
        <>
          <Tag
            color={statusColor[get(render, "status", "")]}
            key={get(render, "status", "")}
          >
            {get(render, "status", "").toUpperCase()}
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
