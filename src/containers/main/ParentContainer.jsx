import { Tabs, Drawer } from "antd";
import React, { useState } from "react";
import ActionsDropdown from "../../components/dropdowns/ActionsDropdown";
import RestaurantForm from "../../components/forms/RestaurantForm";
import OrdersTable from "../orders/OrdersTable";
import OrderForm from "../../components/forms/OrderForm";
import DriverForm from "../../components/forms/DriverForm";
import ExportForm from "../../components/forms/ExportForm";
import DriversEditableTable from "../drivers/DriversEditableTable";
import RestaurantsTable from "../restaurants/RestaurantsTable";

let initialState = {
  open: false,
  module: "",
};

const ParentContainer = (props) => {
  const [parentObject, setparentObject] = useState(initialState);

  const onClose = () => {
    setparentObject({
      ...parentObject,
      open: false,
      module: "",
    });
  };
  const handleMenu = (props) => {
    setparentObject({
      ...parentObject,
      open: true,
      module: props.key,
    });
  };
  const operations = <ActionsDropdown handleMenu={handleMenu} />;
  const tabContents = [
    {
      label: "Orders",
      key: 1,
      children: <OrdersTable />,
    },
    {
      label: "Restaurants",
      key: 2,
      children: <RestaurantsTable />,
    },
    {
      label: "Drivers",
      key: 3,
      children: <DriversEditableTable />,
    },
  ];

  return (
    <div>
      <>
        <Tabs tabBarExtraContent={operations} items={tabContents} />
      </>
      <>
        <Drawer
          title={
            parentObject.module === "0"
              ? "Add Order"
              : parentObject.module === "1"
              ? "Add Restaurants"
              : parentObject.module === "2"
              ? "Add Driver"
              : parentObject.module === "3"
              ? "Export"
              : null
          }
          width={720}
          onClose={onClose}
          open={parentObject.open}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <div>
            {parentObject.open ? (
              parentObject.module === "0" ? (
                <OrderForm onClose={onClose} />
              ) : parentObject.module === "1" ? (
                <RestaurantForm onClose={onClose} />
              ) : parentObject.module === "2" ? (
                <DriverForm onClose={onClose} />
              ) : parentObject.module === "3" ? (
                <ExportForm onClose={onClose} />
              ) : null
            ) : null}
          </div>
        </Drawer>
      </>
    </div>
  );
};

export default ParentContainer;
