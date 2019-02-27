import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function ResultList(props) {
  const columns = [
    {
      id: "countryName",
      Header: "Country",
      accessor: d => d.country.value
    },
    {
      id: "population",
      Header: "Population",
      accessor: d => d.value
    },
    {
      id: "emissions",
      Header: "CO2 Emissions (kt)",
      accessor: d => d.emissions
    },
    {
      id: "emissions-population",
      Header: "CO2 Emissions (t) per Capita",
      accessor: d => (d.emissions * 1000) / d.value
    }
  ];

  const subColumns = [
    {
      id: "date",
      Header: "Year",
      accessor: d => d.date
    },
    {
      id: "population",
      Header: "Population",
      accessor: d => d.value
    },
    {
      id: "emissions",
      Header: "CO2 Emissions (kt)",
      accessor: d => d.emissions
    },
    {
      id: "emissions-population",
      Header: "CO2 Emissions (t) per Capita",
      accessor: d => (d.emissions * 1000) / d.value
    }
  ];

  return (
    <ReactTable
      data={props.data.filter(country => country.date === props.selectedDate)}
      columns={columns}
      className="-striped -highlight"
      SubComponent={row => {
        return (
          <ReactTable
            showPagination={false}
            defaultPageSize={100}
            minRows={0}
            data={props.data.filter(
              country => country.country.value === row.row.countryName
            )}
            columns={subColumns}
          />
        );
      }}
    />
  );
}
