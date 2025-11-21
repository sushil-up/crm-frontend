import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { values } from "lodash";

export function getHealthIcon(health) {
  const getColorClass = () => {
    if (health >= 80) {
      return "text-green-700";
    } else if (health >= 60) {
      return "text-yellow-700";
    } else if (health >= 40) {
      return "text-orange-700";
    } else {
      return "text-red-700";
    }
  };

  return (
    <div className="helthProgress">
      <div className="text-gray-900">{health}</div>
      <div>
        <CircleTwoToneIcon
          variant="determinate"
          values={health}
          className={`${getColorClass()} !text-5xl`}
        />
      </div>
    </div>
  );
}
