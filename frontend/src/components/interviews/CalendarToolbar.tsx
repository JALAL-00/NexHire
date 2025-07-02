'use client';

import { Navigate, View, ToolbarProps, Event } from 'react-big-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarToolbar = ({ label, view, onView, onNavigate }: ToolbarProps<Event, object>) => {
  return (
    <div className="rbc-toolbar mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Navigation Buttons (Back, Today, Next) */}
      <div className="btn-group">
        
        {/* --- THIS IS THE FIX (Part 1) --- */}
        {/* Add `flex-nowrap` to prevent the text from wrapping below the icon. */}
        <button
          type="button"
          className="btn gap-2 flex-nowrap"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </button>
        
        {/* --- THIS IS THE FIX (Part 2) --- */}
        {/* Add `flex-nowrap` here as well for consistency. */}
        <button
          type="button"
          className="btn gap-2 flex-nowrap"
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* The label showing the current month/date range */}
      <h2 className="text-xl font-bold text-gray-700 order-first sm:order-none">
        {label}
      </h2>

      {/* View Switcher (Month, Week, Day) */}
      <div className="btn-group">
        <button
          type="button"
          className={`btn ${view === 'month' ? 'btn-primary' : ''}`}
          onClick={() => onView('month')}
        >
          Month
        </button>
        <button
          type="button"
          className={`btn ${view === 'week' ? 'btn-primary' : ''}`}
          onClick={() => onView('week')}
        >
          Week
        </button>
        <button
          type="button"
          className={`btn ${view === 'day' ? 'btn-primary' : ''}`}
          onClick={() => onView('day')}
        >
          Day
        </button>
      </div>
    </div>
  );
};