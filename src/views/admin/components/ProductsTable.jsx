/* eslint-disable react/forbid-prop-types */
import PropType from 'prop-types';
import React from 'react';
import { ProductItem } from '.';

const ProductsTable = ({ filteredProducts }) => (
  <div>
  {filteredProducts.length > 0 && (
    <div className="grid grid-product grid-count-7"> {/* Adjusted to grid-count-7 */}
      <div className="grid-col" />
      
      <div className="grid-col" style={{ width: "20%" }}>
        <h5>Name</h5>
      </div>
      
      <div className="grid-col" style={{ width: "20%" }}>
        <h5>Brand</h5>
      </div>
      
      <div className="grid-col" style={{ width: "20%" }}>
        <h5>Price</h5>
      </div>
      
      <div className="grid-col" style={{ width: "15%" }}>
        <h5>Date Added</h5>
      </div>
      <div className="grid-col" style={{ width: "15%" }}> {/* Link column added */}
        <h5>Link</h5>
      </div>
      
      <div className="grid-col" style={{ width: "10%" }}>
        <h5>Qty</h5>
      </div>
      
    </div>
  )}
  
  
  
    {filteredProducts.length === 0 ? new Array(10).fill({}).map((product, index) => (
      <ProductItem
        // eslint-disable-next-line react/no-array-index-key
        key={`product-skeleton ${index}`}
        product={product}
      />
    )) : filteredProducts.map((product) => (
      <ProductItem
        key={product.id}
        product={product}
      />
    ))}
  </div>
);

ProductsTable.propTypes = {
  filteredProducts: PropType.array.isRequired
};

export default ProductsTable;
