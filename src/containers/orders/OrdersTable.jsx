import { Badge, Drawer, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { get } from "lodash";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { ordersRef } from "../../utils/services/ReactQueryServices";
import { StyledDiv } from "../../components/common/StyledGuide";
import OrderFormEdit from "../../components/forms/OrderFormEdit";
import dayjs from "dayjs";

const statusColor = {
  completed: "#52c41a",
  failed: "red",
  inprogress: "orange",
  hold: "blue",
};

const initial = {
  editDrawer: false,
  editDetails: {},
};

const OrdersTable = () => {
  const [orderState, setorderState] = useState(initial);
  const queryOrders = useFirestoreQuery(["orders"], ordersRef, {
    subscribe: true,
  });
  const fetchOrders = queryOrders.data?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const handleEdit = (record) => {
    setorderState({
      openDrawer: true,
      editDetails: record,
    });
  };

  const onClose = () => {
    setorderState({
      openDrawer: false,
      editDetails: {},
    });
  };

  const columns = [
    {
      title: "OrderNo.",
      dataIndex: "orderNumber",
      key: "orderNumber",
      align: "left",
      width: 125,
      fixed: "left",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Restaurant",
      dataIndex: "name",
      key: "name",
      align: "left",
      fixed: "left",
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      width: 50,
      render: (text) => (
        <div>
          <Badge
            count={text ? "Yes" : "No"}
            style={{
              backgroundColor: text ? "#52c41a" : "red",
            }}
          />
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "Kms",
      dataIndex: "miles",
      key: "miles",
      sorter: (a, b) => a.miles - b.miles,
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "Cust. Location",
      key: "customerLocation",
      dataIndex: "customerLocation",
    },
    {
      title: "Cust. Number",
      key: "customerNumber",
      dataIndex: "customerNumber",
    },
    {
      title: "Kms Start",
      dataIndex: "mileageStart",
      key: "mileageStart",
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "Kms End",
      dataIndex: "mileageEnd",
      key: "mileageEnd",
      render: (text) => <div>{`${text}Kms`}</div>,
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.value - b.value,
      defaultSortOrder: "descend",
      render: (_, render) => {
        return <>{dayjs.unix(render.date).format("MMM D, YYYY h:mm A")}</>;
      },
    },

    {
      title: "Status",
      key: "status",
      fixed: "right",
      dataIndex: "status",
      render: (_, render) => {
        return (
          <>
            <Badge
              style={{
                backgroundColor: statusColor[get(render, "status", "")],
              }}
              key={get(render, "status", "")}
              count={get(render, "status", "").toUpperCase()}
            />
          </>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      render: (text) => <div>{`Rs.${text}`}</div>,
    },
    {
      title: "Delivery",
      dataIndex: "deliveryCharge",
      key: "deliveryCharge",
      fixed: "right",
      sorter: (a, b) => a.value - b.value,
      render: (text) => <div>{`Rs.${text}`}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  const tableProps = {
    bordered: true,
  };
  return (
    <>
      <StyledDiv height={"500px"}>
        <Table
          {...tableProps}
          columns={columns}
          dataSource={fetchOrders}
          loading={queryOrders.isLoading}
          size="small"
          scroll={{
            y: 380,
          }}
        />
      </StyledDiv>
      <Drawer
        title={"Edit Order"}
        width={720}
        onClose={onClose}
        open={orderState.openDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div>
          <OrderFormEdit
            editDetails={orderState.editDetails}
            onClose={onClose}
          />
        </div>
      </Drawer>
    </>
  );
};
export default OrdersTable;
