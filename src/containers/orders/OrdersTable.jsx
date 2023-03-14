import { Badge, Drawer, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { get } from "lodash";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { ordersRef } from "../../utils/services/ReactQueryServices";
import { StyledDiv } from "../../components/common/StyledGuide";
import OrderFormEdit from "../../components/forms/OrderFormEdit";
import dayjs from "dayjs";
import moment from "moment/moment";
const { Text } = Typography;
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
      width: 100,
      sorter: (a, b) => a.name - b.name,
      align: "left",
      fixed: "left",
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      fixed: "left",
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
      width: 100,
      sorter: (a, b) => a.location - b.location,
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
      width: 100,
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
      width: 150,
      dataIndex: "customerLocation",
    },
    {
      title: "Cust. Number",
      key: "customerNumber",
      width: 100,
      dataIndex: "customerNumber",
    },
    {
      title: "Kms Start",
      dataIndex: "mileageStart",
      key: "mileageStart",
      width: 80,
      render: (text) => <div>{`${text}Kms`}</div>,
    },
    {
      title: "Kms End",
      dataIndex: "mileageEnd",
      key: "mileageEnd",
      width: 80,
      render: (text) => <div>{`${text}Kms`}</div>,
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 200,
      sorter: (a, b) => a.value - b.value,
      defaultSortOrder: "descend",
      render: (_, render) => {
        return (
          <>{moment.unix(render.date / 1000).format("MMM Do, YYYY h:mm A")}</>
        );
      },
    },

    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      fixed: "right",
      sorter: (a, b) => a.value - b.value,
      render: (text) => <div>{`Rs.${text}`}</div>,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      fixed: "right",
      width: 150,
      sorter: (a, b) => a.status - b.status,
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
      fixed: "right",
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
            x: 1600,
            y: 350,
          }}
          summary={(pageData) => {
            let totalMiles = 0;
            let totalValue = 0;
            let totaldelivery = 0;
            pageData.forEach(({ miles, value, deliveryCharge }) => {
              totalMiles += parseInt(miles);
              totalValue += parseInt(value);
              totaldelivery += parseInt(deliveryCharge);
            });
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={2} index={0}>
                    Total Order value
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={2} index={1}>
                    <Text type="danger">{totalValue}</Text>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell colSpan={2} index={2}>
                    Total Kilometers
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={2}>
                    <Text type="danger">{totalMiles}</Text>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell colSpan={2} index={4}>
                    Total Delivery charges
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={2} index={5}>
                    <Text type="danger">{totaldelivery}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
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
