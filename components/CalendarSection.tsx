
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, isToday, startOfWeek, endOfWeek, addWeeks, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2, Maximize2, Minimize2, MapPin, Trophy, Dumbbell, Flag } from 'lucide-react';
import { CalendarEvent } from '../types';
import * as storage from '../services/storage';

interface CalendarSectionProps {
  isAdmin: boolean;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ isAdmin }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Used for Month View navigation
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isExpanded, setIsExpanded] = useState(false); // Default to compact view (false)
  
  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventType, setNewEventType] = useState<'practice' | 'competition' | 'event'>('practice');

  useEffect(() => {
    setEvents(storage.getEvents());
  }, []);

  // Calculate days based on view mode
  // Compact mode: Current week + Next week (14 days total)
  // Expanded mode: Full month
  const days = isExpanded 
    ? eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      })
    : eachDayOfInterval({
        start: startOfWeek(new Date()), 
        end: endOfWeek(addWeeks(new Date(), 1)) 
      });

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      title: newEventTitle,
      time: newEventTime,
      location: newEventLocation,
      type: newEventType,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);
    
    // Reset form
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventLocation('');
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(ev => ev.id !== id);
    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);
  };

  const selectedDateEvents = selectedDate 
    ? events.filter(ev => ev.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  return (
    <section 
      id="calendar" 
      className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm"
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}
    >
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sanyu-red-5 rounded-full opacity-50 blur-xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
              球隊行事曆 <span className="text-sanyu-red">.</span>
            </h2>
            <p className="text-gray-400">
              {isExpanded ? "每月完整行程與比賽安排。" : "本週與下週的重點行程。"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Calendar Grid - INCREASED SIZE (col-span-8/9) */}
          <div className="md:col-span-8 lg:col-span-9 bg-sanyu-dark-90 p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur-sm flex flex-col">
            
            {/* Calendar Header */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="text-sanyu-red" />
                  {isExpanded ? format(currentDate, 'yyyy年 M月') : "近期行程 (兩週)"}
                </h3>
              </div>

              <div className="flex gap-2 items-center">
                {/* Navigation only in Expanded Mode */}
                {isExpanded && (
                  <div className="flex gap-1 mr-2 bg-black rounded-lg p-1 border border-gray-800">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-800 rounded text-white transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-800 rounded text-white transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                
                {/* Toggle View Mode */}
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-bold border border-gray-700"
                >
                  {isExpanded ? (
                    <>
                      <Minimize2 size={16} /> 收合
                    </>
                  ) : (
                    <>
                      <Maximize2 size={16} /> 展開月曆
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-xs font-bold text-gray-500 uppercase tracking-wider py-2">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {/* Padding for start of month (Only in Expanded/Month View) */}
              {isExpanded && Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px] bg-transparent"></div>
              ))}
              
              {days.map(day => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayEvents = events.filter(e => e.date === dayStr);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                // In compact view, all displayed days are active. In month view, filter by month.
                const isCurrentMonth = isExpanded ? isSameMonth(day, currentDate) : true;
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative min-h-[80px] md:min-h-[100px] rounded-lg p-1 text-left transition-all border
                      flex flex-col items-start justify-start overflow-hidden group
                      ${!isCurrentMonth ? 'opacity-30 bg-transparent border-transparent' : ''}
                      ${isSelected 
                        ? 'bg-gray-800 border-sanyu-red ring-1 ring-sanyu-red' 
                        : 'bg-sanyu-black-40 border-gray-800 hover:border-gray-600 hover:bg-gray-900'}
                    `}
                  >
                    {/* Date Number */}
                    <span className={`
                      text-xs font-bold mb-1 px-1.5 py-0.5 rounded absolute top-1 right-1
                      ${isTodayDate 
                        ? 'bg-sanyu-red text-white' 
                        : isSelected ? 'text-white' : 'text-gray-500'}
                    `}>
                      {format(day, 'd')}
                    </span>

                    {/* Events List as Text Labels */}
                    <div className="w-full flex flex-col gap-1 mt-6">
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <div 
                          key={idx} 
                          className={`
                            text-[10px] md:text-xs truncate w-full rounded px-1.5 py-1 flex items-center gap-1.5 font-bold shadow-sm
                            ${ev.type === 'competition' 
                              ? 'bg-gradient-to-r from-yellow-900/60 to-yellow-800/40 text-yellow-200 border border-yellow-700/50' 
                              : ev.type === 'practice'
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                : 'bg-sanyu-red-10 text-sanyu-red-50 border border-sanyu-red-30'}
                          `}
                          title={ev.title}
                        >
                          {ev.type === 'competition' && <Trophy size={10} className="shrink-0 text-yellow-500" />}
                          {ev.type === 'practice' && <Dumbbell size={10} className="shrink-0" />}
                          {ev.type === 'event' && <Flag size={10} className="shrink-0" />}
                          <span className="truncate tracking-tight">{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                         <span className="text-[9px] text-gray-500 pl-1 font-medium">+{dayEvents.length - 3} 更多</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {!isExpanded && (
              <div className="mt-4 text-center">
                 <p className="text-gray-500 text-xs">僅顯示本週與下週行程，點擊「展開月曆」查看更多。</p>
              </div>
            )}
          </div>

          {/* Details Panel - REDUCED SIZE (col-span-4/3) */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col h-full mt-8 md:mt-0">
            <div className="bg-sanyu-dark-90 backdrop-blur-sm text-gray-200 p-6 rounded-2xl shadow-xl h-full border border-gray-700 flex flex-col">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-gray-700 pb-4 text-white">
                <Clock className="text-sanyu-red" size={20} />
                {selectedDate ? format(selectedDate, 'yyyy年 M月 d日') : '請選擇日期'}
              </h3>

              <div className="flex-grow overflow-y-auto space-y-3 mb-4 custom-scrollbar" style={{ maxHeight: '400px' }}>
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(ev => (
                    <div key={ev.id} className="bg-zinc-800 p-3 rounded-lg border-l-4 border-sanyu-red group relative hover:bg-zinc-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg leading-tight text-white">{ev.title}</h4>
                          {ev.time && (
                            <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                              <Clock size={14} />
                              <span>{ev.time}</span>
                            </div>
                          )}
                          {ev.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                              <MapPin size={14} />
                              <span>{ev.location}</span>
                            </div>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block font-semibold 
                            ${ev.type === 'competition' ? 'bg-yellow-900-40 text-yellow-500 border border-yellow-700-50' : 'bg-gray-700 text-gray-300'}`}>
                            {ev.type === 'competition' ? '比賽' : ev.type === 'practice' ? '練習' : '活動'}
                          </span>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="text-gray-500 hover:text-sanyu-red p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-10 italic flex flex-col items-center">
                    <span className="text-4xl mb-2 opacity-20">📅</span>
                    {selectedDate ? "本日尚無行程。" : "點擊日期查看詳細內容。"}
                  </div>
                )}
              </div>

              {/* Admin Add Event Form */}
              {isAdmin && selectedDate && (
                <form onSubmit={handleAddEvent} className="border-t border-gray-700 pt-4 mt-auto">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">新增行程</h4>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="行程標題" 
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      className="w-full bg-sanyu-black-50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-sanyu-red focus:outline-none"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="地點 (選填)" 
                      value={newEventLocation}
                      onChange={e => setNewEventLocation(e.target.value)}
                      className="w-full bg-sanyu-black-50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-sanyu-red focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="時間 (例: 16:00)" 
                        value={newEventTime}
                        onChange={e => setNewEventTime(e.target.value)}
                        className="w-1/2 bg-sanyu-black-50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-sanyu-red focus:outline-none"
                      />
                      <select 
                        value={newEventType}
                        onChange={e => setNewEventType(e.target.value as any)}
                        className="w-1/2 bg-sanyu-black-50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-sanyu-red focus:outline-none"
                      >
                        <option value="practice">練習</option>
                        <option value="competition">比賽</option>
                        <option value="event">其他</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-sanyu-red text-white font-bold py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> 新增行程
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
