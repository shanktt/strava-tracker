import Calendar from "@/components/Calendar";

export default function Test() {
  return (
    <Calendar
      data={[{ date: "2021-01-01", count: 1, value: 0.5 }, { date: "2021-01-03", count: 1, value: 0.5 }]}
      year={2021}
    />
  );
}
