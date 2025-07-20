import TaskHeatMap from "../../ui/Dashboard/TaskHeatMap";
import TodaysUpdatesTable from "../../ui/Dashboard/TodaysUpdatesTable";

export default function Home() {
  return (
    <div className="p-6">
      <TaskHeatMap />
      <TodaysUpdatesTable />
    </div>
  )
}