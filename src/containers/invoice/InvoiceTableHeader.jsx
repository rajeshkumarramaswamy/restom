import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  orderNumber: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
  },
  date: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },

  description: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
  },
  qty: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: "25%",
  },
});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.description}>Order Number</Text>
    <Text style={styles.date}>Date</Text>
    <Text style={styles.description}>Restaurant</Text>
    <Text style={styles.qty}>Location</Text>
    <Text style={styles.rate}>Driver</Text>
    <Text style={styles.rate}>Kms</Text>
    <Text style={styles.amount}>Amount</Text>
  </View>
);

export default InvoiceTableHeader;
