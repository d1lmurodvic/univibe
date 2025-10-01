import React from 'react';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="join">
      <button
        className="join-item btn"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        «
      </button>
      <button className="join-item btn">
        Page {currentPage} of {totalPages}
      </button>
      <button
        className="join-item btn"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        »
      </button>
    </div>
  );
};

export default CustomPagination;