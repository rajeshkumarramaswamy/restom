import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableFooter = ({ total, deliveryCharges, paidonDelivery }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.description}>TOTAL</Text>
        <Text style={styles.total}>{total}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>Delivery Charges</Text>
        <Text style={styles.total}>{deliveryCharges}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>Paid at delivery</Text>
        <Text style={styles.total}>{paidonDelivery}</Text>
      </View>
    </>
  );
};

export default InvoiceTableFooter;
