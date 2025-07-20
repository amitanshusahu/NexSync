import { endOfMonth, startOfMonth, subMonths, eachDayOfInterval, format, isSameMonth } from "date-fns";
import { API_ROUTES } from "../../../lib/api";
import api from "../../../lib/axios/axios";
import type { Response } from "../../../types/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface TaskResponse extends Response {
  data: {
    id: string;
    description: string;
    completed: boolean;
    priority: string;
    projectId: string | null;
    remarks: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }[]
}

interface HeatmapData {
  date: Date;
  count: number;
}

export default function TaskHeatMap() {
  const today = new Date();
  const startDate = startOfMonth(subMonths(today, 3));
  const endDate = endOfMonth(today);

  const taskQuery = useQuery({
    queryKey: ['tasks', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await api.get<TaskResponse>(
        API_ROUTES.TASKS.GET_TASKS(
          startDate.toISOString(),
          endDate.toISOString()
        )
      );
      return res.data;
    }
  });

  // Process data for heatmap
  const heatmapData = useMemo(() => {
    if (!taskQuery.data) return [];

    // Get all days in the period
    const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });

    // Filter completed tasks and group by day
    const completedTasks = taskQuery.data.data.filter(task => task.completed);

    // Create a map of date to count
    const dateCountMap = new Map<string, number>();

    daysInPeriod.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      dateCountMap.set(dateKey, 0);
    });

    completedTasks.forEach(task => {
      const taskDate = new Date(task.updatedAt);
      const dateKey = format(taskDate, 'yyyy-MM-dd');
      const currentCount = dateCountMap.get(dateKey) || 0;
      dateCountMap.set(dateKey, currentCount + 1);
    });

    // Convert to heatmap data format
    const data: HeatmapData[] = daysInPeriod.map(day => ({
      date: day,
      count: dateCountMap.get(format(day, 'yyyy-MM-dd')) || 0
    }));

    return data;
  }, [taskQuery.data, startDate, endDate]);

  // Group data by weeks for display
  const { weeks, monthPositions } = useMemo(() => {
    const weeksArray: HeatmapData[][] = [];
    let currentWeek: HeatmapData[] = [];

    // Track month label positions: { month: string, position: number }
    const monthPositions: { month: string; position: number }[] = [];
    let lastMonth = '';

    // Find the first day of the first week (Sunday)
    let firstDay = new Date(startDate);
    while (firstDay.getDay() !== 0) {
      firstDay = new Date(firstDay);
      firstDay.setDate(firstDay.getDate() - 1);
    }

    // Get all days from firstDay to endDate
    const allDays = eachDayOfInterval({ start: firstDay, end: endDate });

    allDays.forEach((day, index) => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const currentMonth = format(day, 'MMM');

      // Track month changes for labels
      if (currentMonth !== lastMonth) {
        // Only add label if we have at least 2 days in the month visible
        if (index > 0 && isSameMonth(day, new Date(day.getFullYear(), day.getMonth(), 1))) {
          monthPositions.push({ month: currentMonth, position: weeksArray.length });
        }
        lastMonth = currentMonth;
      }

      const dataForDay = heatmapData.find(d => format(d.date, 'yyyy-MM-dd') === formattedDay) || {
        date: day,
        count: 0
      };

      currentWeek.push(dataForDay);

      if (day.getDay() === 6) { // Saturday
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }

    return { weeks: weeksArray, monthPositions };
  }, [heatmapData, startDate, endDate]);

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-300';
    if (count <= 8) return 'bg-green-400';
    return 'bg-green-500';
  };

  if (taskQuery.isLoading) {
    return (
      <div>loding...</div>
    )
  }

  if (taskQuery.isError) return (
    <div className="p-6 bg-white rounded-lg shadow-md text-red-500">
      Error loading heatmap data
    </div>
  );

  return (
    <div className="p-6 no-scrollbar">
      <div className="w-fit no-scrollbar">
        {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Task Completion Heatmap
      </h2> */}

        <div className="flex items-start gap-1 no-scrollbar">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 mt-7">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-4 text-xs text-gray-500 text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 relative h-6">
              {monthPositions.map(({ month, position }, idx) => (
                <div
                  key={`${month}-${idx}`}
                  className="text-xs text-gray-500 absolute"
                  style={{ left: `${position * 14}px`, width: '50px' }}
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1 no-scrollbar">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1 no-scrollbar">
                  {week.map((dayData, dayIdx) => {
                    // const isCurrentMonth = isSameMonth(dayData.date, today);
                    const isFuture = dayData.date > today;
                    // const isToday = format(dayData.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                    return (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`w-4 h-4 rounded-sm ${getColor(dayData.count)} 
                        ${isFuture ? 'opacity-40' : ''}
                        relative group transition-all duration-100 hover:scale-125 hover:z-10 hover:shadow-md`}
                      >
                        <div className="absolute hidden group-hover:block z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm bg-gray-800 text-white rounded-lg whitespace-nowrap shadow-lg">
                          <div className="font-medium">{format(dayData.date, 'MMM d')}</div>
                          <div className="text-green-300">
                            {dayData.count} done
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 no-scrollbar">
          <div className="text-xs text-gray-500">
            {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Less</span>
            <div className="flex gap-1">
              {[0, 2, 5, 8, 10].map((value, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-sm ${getColor(value)}`}
                  title={`${value} task${value !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}