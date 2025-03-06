import React from "react";

const FormattedDate = ({ dateString }) => {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  }).format(date);

  return <>{formattedDate}</>;
};

export default FormattedDate;
