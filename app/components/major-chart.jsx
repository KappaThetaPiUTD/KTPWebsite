import { PieChart } from "recharts";
import { Pie } from "recharts";

const MajorChart = ({ data }) => {
    return (
        <PieChart width={400} height={400}>
        <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
        />
        </PieChart>
    );
}

export default MajorChart;