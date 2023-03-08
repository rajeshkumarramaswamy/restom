import { Drawer, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { get } from "lodash";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { ordersRef } from "../../utils/services/ReactQueryServices";
import moment from "moment/moment";
import { StyledDiv } from "../../components/common/StyledGuide";
import OrderFormEdit from "../../components/forms/OrderFormEdit";

const statusColor = {
  completed: "green",
  failed: "red",
  inprogress: "orange",
  hold: "red",
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
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "MileageStart",
      dataIndex: "mileageStart",
      key: "mileageStart",
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "MileageEnd",
      dataIndex: "mileageEnd",
      key: "mileageEnd",
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text) => <div>{`Rs.${text}`}</div>,
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
