'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Event, Navigate } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { add } from 'date-fns/add';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';

import { CalendarToolbar } from '@/components/interviews/CalendarToolbar';
import { getInterviews, deleteInterview } from '@/lib/api';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function InterviewsSchedulePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- NAVIGATION FIX: Manage the date state here ---
  const [date, setDate] = useState(new Date());

  const fetchAndFormatInterviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const interviews = await getInterviews();
      const formattedEvents = interviews.map(interview => ({
        title: `${interview.title} - ${interview.application?.candidate?.firstName || 'Candidate'}`,
        start: new Date(interview.date),
        end: new Date(new Date(interview.date).getTime() + 60 * 60 * 1000),
        resource: interview, 
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load interviews", error);
      toast.error("Could not load interviews.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAndFormatInterviews();
  }, [fetchAndFormatInterviews]);

  // --- NAVIGATION FIX: Create a handler for navigation ---
  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);

  // --- DELETE FEATURE: Create a handler for event clicks ---
  const handleSelectEvent = useCallback(async (event: Event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this interview?\n\n"${event.title}"`
    );

    if (confirmed && event.resource?.id) {
      const interviewIdToDelete = event.resource.id;
      const originalEvents = [...events];
      
      // Optimistically update UI
      setEvents(prevEvents => prevEvents.filter(e => e.resource.id !== interviewIdToDelete));

      try {
        await deleteInterview(interviewIdToDelete);
        toast.success("Interview deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete interview.");
        // Revert UI on failure
        setEvents(originalEvents);
      }
    }
  }, [events]);

  // --- DELETE FEATURE: Style events to look clickable ---
  const eventStyleGetter = useCallback(() => {
    const style = {
      backgroundColor: '#3498db', // A nice blue
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      cursor: 'pointer', // Make it look clickable
    };
    return { style };
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
       <h1 className="text-3xl font-bold mb-2">Interviews Schedule</h1>
       <p className="text-gray-500 mb-8">
          A centralized view of all your upcoming interviews. Click an event to delete it.
        </p>
      {isLoading ? (
        <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="h-[75vh] bg-base-100 p-4 rounded-lg shadow-md">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            // --- PASS PROPS FOR NAVIGATION AND DELETION ---
            date={date} // Control the date
            onNavigate={handleNavigate} // Handle navigation from the toolbar
            onSelectEvent={handleSelectEvent} // Handle event clicks for deletion
            eventPropGetter={eventStyleGetter} // Style events
            components={{
              toolbar: CalendarToolbar,
            }}
          />
        </div>
      )}
    </div>
  );
}