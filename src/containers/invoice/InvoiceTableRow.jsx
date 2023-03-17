import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import moment from "moment";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  orderNumber: {
    width: "32%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  date: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  restaurant: {
    width: "32%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },

  description: {
    width: "30%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    paddingRight: 8,
  },
  rate: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    paddingRight: 8,
  },
  amount: {
    width: "25%",
    textAlign: "center",
    paddingRight: 8,
  },
});

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item) => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.orderNumber}>{item.orderNumber}</Text>
      <Text style={styles.restaurant}>{item.name}</Text>
      <Text style={styles.date}>
        {moment.unix(item.date / 1000).format("MMM Do, YYYY")}
      </Text>
      <Text style={styles.qty}>{item.location}</Text>
      <Text style={styles.qty}>{item.driver}</Text>
      <Text style={styles.qty}>{`${item.miles} * Rs.${item.costPerKm}`}</Text>
      <Text style={styles.rate}>{item.value}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default InvoiceTableRow;
