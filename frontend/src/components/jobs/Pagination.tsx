// src/components/jobs/Pagination.tsx
'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="btn btn-ghost btn-circle"
      >
        <ChevronLeft />
      </button>
      {pageNumbers.map(number => (
        <button 
          key={number}
          onClick={() => onPageChange(number)}
          className={`btn btn-circle ${currentPage === number ? 'btn-primary' : 'btn-ghost'}`}
        >
          {number}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="btn btn-ghost btn-circle"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;