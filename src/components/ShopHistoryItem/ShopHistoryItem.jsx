import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <span className="badge badge-warning">Pending</span>;
    case "confirmed":
      return <span className="badge badge-success">Confirmed</span>;
    case "returned":
      return <span className="badge badge-info">Returned</span>;
    case "canceled":
      return <span className="badge badge-error">Canceled</span>;
    default:
      return <span className="badge">Unknown</span>;
  }
};

const ShopHistoryItem = ({ item }) => {
  const { product_id, status, time, shop_code } = item;
  const { name, cost, img } = product_id;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-base-200 rounded-lg shadow-md">
      <img src={img} alt={name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-primary font-bold">Cost: {cost}</p>
        <p className="text-xs text-base-content">Order Code: {shop_code}</p>
        <p className="text-xs text-base-content">Date: {dayjs(time).format("YYYY-MM-DD HH:mm")}</p>
      </div>
      <div>{getStatusBadge(status)}</div>
    </div>
  );
};

export default ShopHistoryItem;
