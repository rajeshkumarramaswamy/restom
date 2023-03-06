import React from "react";
import {
  DownOutlined,
  ShoppingTwoTone,
  PrinterTwoTone,
  CarTwoTone,
  ShopTwoTone,
} from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";

const items = [
  {
    label: "Add Order",
    key: "0",
    icon: <ShoppingTwoTone />,
  },
  {
    label: "Add Restaurant",
    key: "1",
    icon: <ShopTwoTone />,
  },
  {
    label: "Add Driver",
    key: "2",
    icon: <CarTwoTone />,
  },

  {
    label: "Export",
    key: "3",
    icon: <PrinterTwoTone />,
  },
];

const ActionsDropdown = (props) => {
  return (
    <Dropdown
      menu={{
        items,
        onClick: props.handleMenu,
      }}
    >
      <Button type="primary" size="middle">
        <Space>
          Actions
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
    // <Dropdown
    //   menu={{
    //     items,
    //     onClick: props.handleMenu,
    //   }}
    //   trigger={["hover"]}
    // >
    //   <a onClick={(e) => e.preventDefault()}>
    //     <Space>
    //       Actions
    //       <DownOutlined />
    //     </Space>
    //   </a>
    // </Dropdown>
  );
};

export default ActionsDropdown;
