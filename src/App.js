import React, { Component } from 'react';
import Collection from './components/collection';
import logo from './logo.svg';
import products from './products-sample.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      sizeFilter: [],
      activeFilter: [],
      filters: []
    }
  }

  componentDidMount() {
    let filters = []
    let filterOptions = []

    products.products.forEach((product) => {
      product.options.forEach((option) => {
        const name = option.name;
        const val = {
          name: name,
          values: []
        }
        if(filters.indexOf(name) === -1) filters.push(name);

        option.values.forEach((value) => {
          if(val.values.indexOf(value) === -1) val.values.push(value);
        })

        filterOptions.push(val)
      })
    })

    let mergedOptions = []
    filterOptions.forEach((value, i) => {
      const option = mergedOptions.filter((v) => v.name == value.name)

      if (!option.length) {
        mergedOptions.push(value)
        return
      }
      let optionIndex = mergedOptions.indexOf(option[0]);
      let mergedValues = mergedOptions[optionIndex].values;

      value.values.forEach((value) => mergedValues.indexOf(value) === -1 ? mergedValues.push(value): "")
    });

    this.setState({
      products: products.products,
      filteredProducts: products.products,
      sizeFilter: filters,
      filters: mergedOptions
    })
  }

  filterOptionsHtml = (options, name) => {
    return options.map((option) => {
      return (
        <li key={option}>
          <input type="checkbox" name="{option}" id={option} onChange={() => this.filterProducts(option, name)}/>
          <label htmlFor={option}>{option}</label>
        </li>
      )
    })
  }

  resetFilter = () => {
    // this.state.activeFilter = []

    // this.setState({
    //   activeFilter: []
    // })

    // this.render()
  }

  filterProducts = (option, name) => {
    const value = {
      name: name,
      values: [option]
    }

    let activeFilters = this.state.activeFilter
    let activeFilterIndex = ""
    let newProducts = []
    let emptyArray = false

    const activeFilter = activeFilters.filter((v, i) => {
      if (v.name == name) activeFilterIndex = i
      return v.name == name
    })

    if (!activeFilter.length) {
      activeFilters.push(value)

      newProducts = this.state.products.filter((product) => {
        let productMatch = false
        let multiMatch = []
        let activeCount = 0

        activeFilters.forEach((filter, i) => {
          const thisFilter = product.options.filter((option) => option.name == filter.name)
          if(filter.values.length > 0) activeCount += 1
          if (thisFilter.length == 0) return
          filter.values.filter((value) => {
            if (thisFilter[0].values.indexOf(value) != -1 ) {
              productMatch = true
              multiMatch.push({ i: i, value: "true"})
            }
          })
        })

        if (activeCount != multiMatch.length) return
        if (productMatch) emptyArray = true
        return productMatch
      })

    } else {

      let mergedValues = this.state.activeFilter[activeFilterIndex].values
      if ( mergedValues.indexOf(option) === -1 ) {
        mergedValues.push(option)
      } else {
        const index = mergedValues.indexOf(option);
        mergedValues.splice(index, 1);
      }

      newProducts = this.state.products.filter((product) => {
        let productMatch = false
        let multiMatch = []
        let activeCount = 0

        activeFilters.forEach((filter, i) => {
          const thisFilter = product.options.filter((option) => option.name == filter.name)
          if(filter.values.length > 0) activeCount += 1
          if (thisFilter.length == 0) return
          filter.values.filter((value) => {
            if (thisFilter[0].values.indexOf(value) != -1 ) {
              productMatch = true
              multiMatch.push({ i: i, value: "true"})
            }
          })
        })


        if (activeCount != multiMatch.length) return
        if (productMatch) emptyArray = true
        return productMatch
      })
    }

    let activeCount2 = 0
    let otherProducts = []
    activeFilters.filter((filter, i) => {
      if(filter.values.length > 0) activeCount2 += 1
    })

    if (activeCount2 == 0) {
      otherProducts = this.state.products
    } else {
      otherProducts = []
    }
    this.setState({
      filteredProducts: newProducts.length > 0 ? newProducts : otherProducts
    })

    this.render()
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <img src="//cdn.shopify.com/s/files/1/2294/8559/t/4/assets/SouthernTide-Logo.svg?6621099185546661470" className="App-logo" alt="logo" />
        </header>

        <div className="products">

          <div className="row">
            <div className="col-sm-12">
              <h1 className="page-title">
                React Sample
              </h1>
            </div>
            <div className="col-sm-3">
            <h2 className="filter-title">Filter</h2>
              {
                this.state.filters.map((filter, i) => {
                  return (
                    <div key={filter.name} className="fitler-wrapper">
                      <h3>{filter.name}</h3>
                      <ul id={filter.name} className="filter-options">
                        {this.filterOptionsHtml(filter.values, filter.name)}
                      </ul>
                    </div>
                  )
                })
              }
            </div>

            <div className="col-sm-9">
              <div className="row">
                <div className="col-sm-12 total">
                  Total of {this.state.filteredProducts.length}
                </div>

                {
                  this.state.filteredProducts.map((product, i) => {
                    return (
                      <div className="col-sm-3" key={product.id}>
                        <div className="product">
                        <h2></h2>
                          <Collection id={i} products={product}/>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
