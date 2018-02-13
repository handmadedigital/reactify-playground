import React from "react";

class Collection extends React.Component {
  render() {
    const product = this.props.products
    const price = this.props.products.variants[0].price

    const img = product.image ? product.image.src :  "http://via.placeholder.com/250x350"
    return (
      <div>
        <div className="image-wrapper">
          <img src={img} alt=""/>
        </div>
        <h3>{product.title}</h3>
        <h4>${price}</h4>
      </div>
    );
  }
}

export default Collection;
