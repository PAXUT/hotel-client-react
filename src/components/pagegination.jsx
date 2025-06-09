import React from "react";
import { Pagination } from "react-bootstrap";

const Pageginate = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageItems = () => {
    const items = [];

    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      {renderPageItems()}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );
};

export default Pageginate;
