import React, { Component } from "react";
import ResultList from "./components/ResultList";
import "./App.css";

const API1 =
  "https://api.worldbank.org/v2/en/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&source=2";
const API2 =
  "https://api.worldbank.org/v2/en/country/all/indicator/EN.ATM.CO2E.KT?format=json&per_page=20000&source=2";

class App extends Component {
  constructor() {
    super();
    this.state = {
      countries: [],
      dates: [],
      isLoading: false,
      selectedDate: "2014",
      search: ""
    };
  }

  setCountries(value) {
    this.setState({ countries: value });
  }

  setDates(value) {
    this.setState({ dates: value });
  }

  setLoading(value) {
    this.setState({ isLoading: value });
  }

  setSelectedDate(value) {
    this.setState({ selectedDate: value });
  }

  setSearch(value) {
    this.setState({ search: value });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    Promise.all([
      fetch(API1).then(response => response.json()),
      fetch(API2).then(response => response.json())
    ])
      .then(response => {
        const API1data = response[0][1];
        const API2data = response[1][1];

        this.setEmissions(API2data, API1data);

        this.setState({
          countries: API1data,
          dates: this.getDates(API1data),
          isLoading: false
        });
      })
      .catch(error => {
        throw Error(error);
      });
  }

  setEmissions(fromArr, toArr) {
    toArr["emissions"] = "";
    for (var i = 0; i < fromArr.length; i++) {
      toArr[i].emissions = Math.round(fromArr[i].value);
    }
  }

  getDates(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      arr.push(data[i].date);
      if (data[i].date === "1960") break;
    }
    return arr;
  }

  handleDateChange = event => {
    this.setSelectedDate(event.target.value);
  };

  handleSearchChange = event => {
    this.setSearch(event.target.value);
  };

  dateSelect() {
    const { dates } = this.state;
    return (
      <select onChange={this.handleDateChange} value={this.state.selectedDate}>
        {dates.map(item => {
          return <option value={item}>{item}</option>;
        })}
      </select>
    );
  }

  countrySearch() {
    const { search } = this.state;
    return (
      <input
        type="text"
        value={search}
        onChange={this.handleSearchChange}
        placeholder="Search"
      />
    );
  }

  render() {
    const { countries, isLoading, selectedDate, search } = this.state;

    var results;
    if (isLoading) {
      results = <p align="center">Loading ...</p>;
    } else {
      results = (
        <ResultList
          data={countries.filter(country =>
            country.country.value.toLowerCase().includes(search.toLowerCase())
          )}
          selectedDate={selectedDate}
        />
      );
    }

    return (
      <div>
        <div id="header">
          <h1>CO2 Emissions</h1>
          <button type="button" onClick={() => this.setSearch("")}>
            Clear
          </button>
          {this.countrySearch()}
          {this.dateSelect()}
        </div>
        <div id="result">{results}</div>
      </div>
    );
  }
}

export default App;
